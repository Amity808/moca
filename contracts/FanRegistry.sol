// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title FanRegistry
 * @dev Smart contract for fan registration and ticket management
 * @notice This contract complements AIR Kit SDKs by providing on-chain fan verification
 *         and anti-scalping mechanisms for event tickets
 */
contract FanRegistry is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event FanRegistered(
        address indexed fan,
        string fanDid,
        uint256 fanScore,
        uint256 timestamp
    );
    event FanScoreUpdated(
        address indexed fan,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    event TicketIssued(
        address indexed fan,
        uint256 indexed eventId,
        uint256 ticketId,
        uint256 timestamp
    );
    event TicketVerified(
        address indexed fan,
        uint256 indexed ticketId,
        bool isValid,
        uint256 timestamp
    );
    event TicketTransferred(
        address indexed from,
        address indexed to,
        uint256 indexed ticketId,
        uint256 timestamp
    );
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string eventName,
        uint256 eventDate
    );
    event FanBlacklisted(address indexed fan, string reason, uint256 timestamp);
    event FanWhitelisted(address indexed fan, uint256 timestamp);

    // Structs
    struct FanProfile {
        string fanDid; // AIR Kit Decentralized Identifier
        uint256 fanScore; // Dynamic fan loyalty score (0-100)
        uint256 registrationTime; // When fan registered
        bool isVerified; // Whether fan is verified through AIR Kit
        bool isBlacklisted; // Anti-scalping blacklist status
        uint256 totalEventsAttended; // Track fan engagement
        mapping(uint256 => bool) eventAttendance; // Event attendance tracking
    }

    struct Event {
        uint256 eventId;
        address organizer;
        string eventName;
        uint256 eventDate;
        uint256 ticketPrice;
        uint256 maxTickets;
        uint256 ticketsSold;
        bool isActive;
        uint256 minFanScore; // Minimum fan score required
        bool requiresVerification; // Whether AIR Kit verification is required
    }

    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        address owner;
        uint256 issueTime;
        bool isUsed;
        bool isTransferable; // Anti-scalping: can ticket be transferred?
        uint256 transferCount; // Track transfer attempts
        string credentialHash; // AIR Kit credential hash
    }

    // State variables
    mapping(address => FanProfile) public fanProfiles;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(string => address) public didToAddress; // Map AIR Kit DID to address
    mapping(address => uint256[]) public fanTickets; // Fan's ticket collection

    uint256 public nextEventId = 1;
    uint256 public nextTicketId = 1;
    uint256 public constant MAX_TRANSFER_COUNT = 1; // Anti-scalping: max transfers allowed
    uint256 public constant TRANSFER_COOLDOWN = 24 hours; // Time between transfers

    // AIR Kit integration
    address public airKitVerifier; // AIR Kit verifier contract address
    mapping(bytes32 => bool) public usedCredentialHashes; // Prevent credential replay

    // Modifiers
    modifier onlyVerifiedFan(address fan) {
        require(
            fanProfiles[fan].isVerified,
            "FanRegistry: Fan not verified through AIR Kit"
        );
        require(
            !fanProfiles[fan].isBlacklisted,
            "FanRegistry: Fan is blacklisted"
        );
        _;
    }

    modifier onlyEventOrganizer(uint256 eventId) {
        require(
            events[eventId].organizer == msg.sender,
            "FanRegistry: Not event organizer"
        );
        _;
    }

    modifier validEvent(uint256 eventId) {
        require(
            events[eventId].eventId != 0,
            "FanRegistry: Event does not exist"
        );
        require(events[eventId].isActive, "FanRegistry: Event is not active");
        _;
    }

    modifier validTicket(uint256 ticketId) {
        require(
            tickets[ticketId].ticketId != 0,
            "FanRegistry: Ticket does not exist"
        );
        _;
    }

    constructor(address _airKitVerifier) {
        airKitVerifier = _airKitVerifier;
    }

    /**
     * @dev Register a fan with AIR Kit verification
     * @param fanDid AIR Kit Decentralized Identifier
     * @param fanScore Initial fan score from AIR Kit credential
     * @param credentialHash Hash of AIR Kit credential for verification
     * @param signature Signature from AIR Kit verifier
     */
    function registerFan(
        string memory fanDid,
        uint256 fanScore,
        string memory credentialHash,
        bytes memory signature
    ) external nonReentrant {
        require(bytes(fanDid).length > 0, "FanRegistry: Invalid fan DID");
        require(fanScore <= 100, "FanRegistry: Invalid fan score");
        require(
            fanProfiles[msg.sender].registrationTime == 0,
            "FanRegistry: Fan already registered"
        );
        require(
            didToAddress[fanDid] == address(0),
            "FanRegistry: DID already registered"
        );

        // Verify AIR Kit credential signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(fanDid, fanScore, credentialHash, block.chainid)
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        require(
            signer == airKitVerifier,
            "FanRegistry: Invalid AIR Kit signature"
        );

        // Check for credential replay
        bytes32 credentialHashBytes = keccak256(
            abi.encodePacked(credentialHash)
        );
        require(
            !usedCredentialHashes[credentialHashBytes],
            "FanRegistry: Credential already used"
        );
        usedCredentialHashes[credentialHashBytes] = true;

        // Register fan
        fanProfiles[msg.sender].fanDid = fanDid;
        fanProfiles[msg.sender].fanScore = fanScore;
        fanProfiles[msg.sender].registrationTime = block.timestamp;
        fanProfiles[msg.sender].isVerified = true;
        fanProfiles[msg.sender].isBlacklisted = false;
        fanProfiles[msg.sender].totalEventsAttended = 0;

        didToAddress[fanDid] = msg.sender;

        emit FanRegistered(msg.sender, fanDid, fanScore, block.timestamp);
    }

    /**
     * @dev Update fan score based on AIR Kit credential verification
     * @param fan Address of the fan
     * @param newScore New fan score from AIR Kit
     * @param credentialHash Hash of updated AIR Kit credential
     * @param signature Signature from AIR Kit verifier
     */
    function updateFanScore(
        address fan,
        uint256 newScore,
        string memory credentialHash,
        bytes memory signature
    ) external onlyOwner {
        require(fanProfiles[fan].isVerified, "FanRegistry: Fan not verified");
        require(newScore <= 100, "FanRegistry: Invalid fan score");

        // Verify AIR Kit credential signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                fanProfiles[fan].fanDid,
                newScore,
                credentialHash,
                block.chainid
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        require(
            signer == airKitVerifier,
            "FanRegistry: Invalid AIR Kit signature"
        );

        // Check for credential replay
        bytes32 credentialHashBytes = keccak256(
            abi.encodePacked(credentialHash)
        );
        require(
            !usedCredentialHashes[credentialHashBytes],
            "FanRegistry: Credential already used"
        );
        usedCredentialHashes[credentialHashBytes] = true;

        uint256 oldScore = fanProfiles[fan].fanScore;
        fanProfiles[fan].fanScore = newScore;

        emit FanScoreUpdated(fan, oldScore, newScore, block.timestamp);
    }

    /**
     * @dev Create a new event
     * @param eventName Name of the event
     * @param eventDate Unix timestamp of event date
     * @param ticketPrice Price per ticket in wei
     * @param maxTickets Maximum number of tickets
     * @param minFanScore Minimum fan score required
     * @param requiresVerification Whether AIR Kit verification is required
     */
    function createEvent(
        string memory eventName,
        uint256 eventDate,
        uint256 ticketPrice,
        uint256 maxTickets,
        uint256 minFanScore,
        bool requiresVerification
    ) external {
        require(bytes(eventName).length > 0, "FanRegistry: Invalid event name");
        require(
            eventDate > block.timestamp,
            "FanRegistry: Event date must be in future"
        );
        require(maxTickets > 0, "FanRegistry: Invalid max tickets");
        require(minFanScore <= 100, "FanRegistry: Invalid min fan score");

        uint256 eventId = nextEventId++;
        events[eventId] = Event({
            eventId: eventId,
            organizer: msg.sender,
            eventName: eventName,
            eventDate: eventDate,
            ticketPrice: ticketPrice,
            maxTickets: maxTickets,
            ticketsSold: 0,
            isActive: true,
            minFanScore: minFanScore,
            requiresVerification: requiresVerification
        });

        emit EventCreated(eventId, msg.sender, eventName, eventDate);
    }

    /**
     * @dev Purchase a ticket for an event
     * @param eventId ID of the event
     * @param credentialHash Hash of AIR Kit credential for verification
     * @param signature Signature from AIR Kit verifier
     */
    function purchaseTicket(
        uint256 eventId,
        string memory credentialHash,
        bytes memory signature
    )
        external
        payable
        onlyVerifiedFan(msg.sender)
        validEvent(eventId)
        nonReentrant
    {
        Event storage eventData = events[eventId];

        require(
            eventData.ticketsSold < eventData.maxTickets,
            "FanRegistry: Event sold out"
        );
        require(
            msg.value >= eventData.ticketPrice,
            "FanRegistry: Insufficient payment"
        );
        require(
            fanProfiles[msg.sender].fanScore >= eventData.minFanScore,
            "FanRegistry: Fan score too low"
        );

        // If verification required, verify AIR Kit credential
        if (eventData.requiresVerification) {
            bytes32 messageHash = keccak256(
                abi.encodePacked(
                    fanProfiles[msg.sender].fanDid,
                    eventId,
                    credentialHash,
                    block.chainid
                )
            );
            bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
            address signer = ethSignedMessageHash.recover(signature);
            require(
                signer == airKitVerifier,
                "FanRegistry: Invalid AIR Kit signature"
            );

            // Check for credential replay
            bytes32 credentialHashBytes = keccak256(
                abi.encodePacked(credentialHash)
            );
            require(
                !usedCredentialHashes[credentialHashBytes],
                "FanRegistry: Credential already used"
            );
            usedCredentialHashes[credentialHashBytes] = true;
        }

        // Issue ticket
        uint256 ticketId = nextTicketId++;
        tickets[ticketId] = Ticket({
            ticketId: ticketId,
            eventId: eventId,
            owner: msg.sender,
            issueTime: block.timestamp,
            isUsed: false,
            isTransferable: true, // Can be made non-transferable for anti-scalping
            transferCount: 0,
            credentialHash: credentialHash
        });

        fanTickets[msg.sender].push(ticketId);
        eventData.ticketsSold++;

        // Refund excess payment
        if (msg.value > eventData.ticketPrice) {
            payable(msg.sender).transfer(msg.value - eventData.ticketPrice);
        }

        emit TicketIssued(msg.sender, eventId, ticketId, block.timestamp);
    }

    /**
     * @dev Transfer ticket to another verified fan (with anti-scalping measures)
     * @param ticketId ID of the ticket
     * @param to Address of the new owner
     * @param credentialHash Hash of AIR Kit credential for verification
     * @param signature Signature from AIR Kit verifier
     */
    function transferTicket(
        uint256 ticketId,
        address to,
        string memory credentialHash,
        bytes memory signature
    ) external validTicket(ticketId) onlyVerifiedFan(to) {
        Ticket storage ticket = tickets[ticketId];

        require(ticket.owner == msg.sender, "FanRegistry: Not ticket owner");
        require(!ticket.isUsed, "FanRegistry: Ticket already used");
        require(ticket.isTransferable, "FanRegistry: Ticket not transferable");
        require(
            ticket.transferCount < MAX_TRANSFER_COUNT,
            "FanRegistry: Max transfers exceeded"
        );

        // Verify AIR Kit credential for transfer
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                fanProfiles[to].fanDid,
                ticketId,
                credentialHash,
                block.chainid
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        require(
            signer == airKitVerifier,
            "FanRegistry: Invalid AIR Kit signature"
        );

        // Check for credential replay
        bytes32 credentialHashBytes = keccak256(
            abi.encodePacked(credentialHash)
        );
        require(
            !usedCredentialHashes[credentialHashBytes],
            "FanRegistry: Credential already used"
        );
        usedCredentialHashes[credentialHashBytes] = true;

        // Transfer ticket
        ticket.owner = to;
        ticket.transferCount++;

        // Add ticket to new owner's collection
        fanTickets[to].push(ticketId);

        emit TicketTransferred(msg.sender, to, ticketId, block.timestamp);
    }

    /**
     * @dev Verify ticket at event entry
     * @param ticketId ID of the ticket
     * @param credentialHash Hash of AIR Kit credential for verification
     * @param signature Signature from AIR Kit verifier
     */
    function verifyTicket(
        uint256 ticketId,
        string memory credentialHash,
        bytes memory signature
    ) external validTicket(ticketId) {
        Ticket storage ticket = tickets[ticketId];
        Event storage eventData = events[ticket.eventId];

        require(
            eventData.organizer == msg.sender,
            "FanRegistry: Not event organizer"
        );
        require(!ticket.isUsed, "FanRegistry: Ticket already used");

        // Verify AIR Kit credential
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                fanProfiles[ticket.owner].fanDid,
                ticketId,
                credentialHash,
                block.chainid
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        require(
            signer == airKitVerifier,
            "FanRegistry: Invalid AIR Kit signature"
        );

        // Check for credential replay
        bytes32 credentialHashBytes = keccak256(
            abi.encodePacked(credentialHash)
        );
        require(
            !usedCredentialHashes[credentialHashBytes],
            "FanRegistry: Credential already used"
        );
        usedCredentialHashes[credentialHashBytes] = true;

        // Mark ticket as used and update fan attendance
        ticket.isUsed = true;
        fanProfiles[ticket.owner].eventAttendance[ticket.eventId] = true;
        fanProfiles[ticket.owner].totalEventsAttended++;

        emit TicketVerified(ticket.owner, ticketId, true, block.timestamp);
    }

    /**
     * @dev Blacklist a fan (anti-scalping measure)
     * @param fan Address of the fan to blacklist
     * @param reason Reason for blacklisting
     */
    function blacklistFan(
        address fan,
        string memory reason
    ) external onlyOwner {
        require(fanProfiles[fan].isVerified, "FanRegistry: Fan not registered");
        fanProfiles[fan].isBlacklisted = true;
        emit FanBlacklisted(fan, reason, block.timestamp);
    }

    /**
     * @dev Whitelist a fan (remove from blacklist)
     * @param fan Address of the fan to whitelist
     */
    function whitelistFan(address fan) external onlyOwner {
        require(fanProfiles[fan].isVerified, "FanRegistry: Fan not registered");
        fanProfiles[fan].isBlacklisted = false;
        emit FanWhitelisted(fan, block.timestamp);
    }

    /**
     * @dev Make ticket non-transferable (anti-scalping measure)
     * @param ticketId ID of the ticket
     */
    function makeTicketNonTransferable(
        uint256 ticketId
    ) external validTicket(ticketId) {
        Ticket storage ticket = tickets[ticketId];
        Event storage eventData = events[ticket.eventId];

        require(
            eventData.organizer == msg.sender,
            "FanRegistry: Not event organizer"
        );
        ticket.isTransferable = false;
    }

    /**
     * @dev Get fan's ticket collection
     * @param fan Address of the fan
     * @return Array of ticket IDs owned by the fan
     */
    function getFanTickets(
        address fan
    ) external view returns (uint256[] memory) {
        return fanTickets[fan];
    }

    /**
     * @dev Get fan profile
     * @param fan Address of the fan
     * @return fanDid AIR Kit Decentralized Identifier
     * @return fanScore Current fan score
     * @return registrationTime When fan registered
     * @return isVerified Whether fan is verified
     * @return isBlacklisted Whether fan is blacklisted
     * @return totalEventsAttended Total events attended
     */
    function getFanProfile(
        address fan
    )
        external
        view
        returns (
            string memory fanDid,
            uint256 fanScore,
            uint256 registrationTime,
            bool isVerified,
            bool isBlacklisted,
            uint256 totalEventsAttended
        )
    {
        FanProfile storage profile = fanProfiles[fan];
        return (
            profile.fanDid,
            profile.fanScore,
            profile.registrationTime,
            profile.isVerified,
            profile.isBlacklisted,
            profile.totalEventsAttended
        );
    }

    /**
     * @dev Check if fan attended specific event
     * @param fan Address of the fan
     * @param eventId ID of the event
     * @return Whether fan attended the event
     */
    function didFanAttendEvent(
        address fan,
        uint256 eventId
    ) external view returns (bool) {
        return fanProfiles[fan].eventAttendance[eventId];
    }

    /**
     * @dev Update AIR Kit verifier address
     * @param newVerifier New verifier address
     */
    function updateAirKitVerifier(address newVerifier) external onlyOwner {
        require(
            newVerifier != address(0),
            "FanRegistry: Invalid verifier address"
        );
        airKitVerifier = newVerifier;
    }

    /**
     * @dev Withdraw contract balance (for event organizers)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
