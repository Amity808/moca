'use client';

import { useState } from 'react';
import { useAirKit } from '@/components/AirKitProvider';

interface CredentialResult {
    id: string;
    status: string;
    credential: string;
}

interface CredentialSubject {
    "@context": Array<{
        "@version": number;
        "@protected": boolean;
        id: string;
        type: string;
        fankyc: {
            "@id": string;
            "@context": Record<string, unknown>;
        };
    }>;
    type: string;
    credentialSubject: {
        id: string;
        type: string;
        country: string;
        gender: string;
        fanSince: string;
        verificationMethod: string;
        socialMediaEngagement: string;
    };
}

export default function FanCredentialIssuer() {
    const { service, isLoggedIn, userAddress, loginResult } = useAirKit();
    const [isIssuing, setIsIssuing] = useState(false);
    const [credentialResult, setCredentialResult] = useState<CredentialResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Decode JWT token to extract partner ID
    const decodeJWT = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    };

    // Get the JWT token from login result
    const getAuthToken = () => {
        if (loginResult?.token) {
            return loginResult.token;
        }
        // Fallback to hardcoded token if no login result
        return "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMyMXM4MGcwaDJyNDkwMDk2MjAzemIifQ.eyJwYXJ0bmVySWQiOiIwYzE4MTc3YS1hOTYwLTQyNjUtYTg4OC1lZjY5YzNkNjc3MWMiLCJzY29wZSI6Imlzc3VlIHZlcmlmeSIsImV4cCI6MTc2MDYzMjM0Mn0.oOf5ivjsqvZimmhjcLhlIhau0j75S89MMB5C5ZIpE0eInas6Pnc9voXVgw1SpuZAcLTTVSvVorYOJ-I0nioijeHbbEwO4_edsDrGnYoYJO01CHzxlL_t8t13XbvrLW4AMvBVY0KyeOtJI8hEOIsS29zBiXATvY5UOfcEkQNYIFhBFCqo_7bSHF-h-Hgkb6vPFoT5MUrbDaOKk1MD2iDgKpTguWMxGviYceD8mfvbxefD66N5OcmR9nOYDVhvVnArl2hrNZ1F7cpaZa2lceb28wiNfsfu-M7pKC3CNH06IgwtGRGPxq8Q1_sUFNKzQBToYMASaRtxorcDEUfQlqZa1zyBmQ2gEbZvycD-XoJ-Z6YiS51JNBEgP2ghWbcr8nTXkc85_AfUX8VWnXp_iZc4jFsY--3nDYRn9MDGI_E8LNuUTurz1bUnQaxQTUhnZjwvcY4eAge5jkPzvmtoZltN-I8eyQADlh6ECgvDFuZxNDIQTrigx8BnG4Woh-TQJmOO0qFUkxtoiScqDta1mhINx8XUJtUttWl7tjytdVcjY7pOgtj-EC9mAtELmCk9arro6N9u33I_KVjXQKbP1n8fUY7vez66RQOy23xe3wiD53rv7PuJR_ou4Jg8KOr8xctH6phNSRwj5bcd4rnVSy0YKH_B0fxv9zQkKDKGg2w85LE";
    };

    // Fan credential subject data
    const [credentialSubject, setCredentialSubject] = useState<CredentialSubject>({
        "@context": [
            {
                "@version": 1.1,
                "@protected": true,
                "id": "@id",
                "type": "@type",
                "fankyc": {
                    "@id": "urn:uuid:9479c3e7-636b-4322-b69b-d9164a1614f0",
                    "@context": {
                        "@protected": true,
                        "@propagate": true,
                        "@version": 1.1,
                        "id": "@id",
                        "type": "@type",
                        "xsd": "http://www.w3.org/2001/XMLSchema#",
                        "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/common-v2.md",
                        "country": {
                            "@id": "kyc-vocab:country",
                            "@type": "xsd:string"
                        },
                        "gender": {
                            "@id": "kyc-vocab:gender",
                            "@type": "xsd:string"
                        },
                        "fanSince": {
                            "@id": "kyc-vocab:fanSince",
                            "@type": "xsd:string"
                        },
                        "verificationMethod": {
                            "@id": "kyc-vocab:verificationMethod",
                            "@type": "xsd:string"
                        },
                        "socialMediaEngagement": {
                            "@id": "kyc-vocab:socialMediaEngagement",
                            "@type": "xsd:string"
                        }
                    }
                }
            }
        ],
        "type": "fankyc",
        "credentialSubject": {
            "id": userAddress || "did:example:fan123",
            "type": "fankyc",
            "country": "US",
            "gender": "non-binary",
            "fanSince": "2023-01-15",
            "verificationMethod": "social_media_analysis",
            "socialMediaEngagement": "verified"
        }
    });

    const issueFanCredential = async () => {
        if (!service || !isLoggedIn) {
            setError("Please log in first to issue credentials");
            return;
        }

        setIsIssuing(true);
        setError(null);
        setCredentialResult(null);

        try {
            // Use the JWT token from login result
            const authToken = getAuthToken();

            console.log("=== CREDENTIAL ISSUANCE DEBUG ===");
            console.log("Using auth token:", authToken);
            console.log("Login result:", loginResult);

            // Decode JWT to get partner ID
            const jwtPayload = decodeJWT(authToken);
            console.log("JWT Payload:", jwtPayload);
            console.log("Partner ID from JWT:", jwtPayload?.partnerId);
            console.log("Expected Partner ID: 643f36f7-fff3-4e60-ac7a-8fecaaa39ddf");
            console.log("Partner ID Match:", jwtPayload?.partnerId === "643f36f7-fff3-4e60-ac7a-8fecaaa39ddf");

            console.log("Credential ID:", "c21s80g0h2r490096203zb");
            console.log("Issuer DID:", "did:air:id:test:4P6qSxJfHHzNY4RoQSGenGoZpumYL1HspaZHeNjF5n");
            console.log("Credential Subject:", credentialSubject);
            console.log("=================================");

            // Issue the credential
            const result = await service.issueCredential({
                authToken: authToken,
                issuerDid: "did:air:id:test:4P6qSxJfHHzNY4RoQSGenGoZpumYL1HspaZHeNjF5n",
                credentialId: "c21sa061df12f00h1837IA",
                credentialSubject: credentialSubject,

            });

            console.log("Credential issued successfully:", result);
            setCredentialResult(result);
        } catch (error: unknown) {
            console.error("Failed to issue credential:", error);
            console.log(error, "insurance")
            setError(error instanceof Error ? error.message : "Failed to issue credential");
        } finally {
            setIsIssuing(false);
        }
    };

    const updateCredentialField = (field: string, value: string) => {
        setCredentialSubject(prev => ({
            ...prev,
            credentialSubject: {
                ...prev.credentialSubject,
                [field]: value
            }
        }));
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Please Log In</h1>
                    <p className="text-gray-300 mb-8">You need to be logged in to issue fan credentials.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <header className="bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="text-white text-xl font-bold">FanVerify</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-white text-sm">
                                    {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connected'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Issue Fan Credential</h1>
                    <p className="text-gray-300 text-lg">
                        Create a verified fan credential using AIR Kit Credential Services
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Configuration Panel */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                        <h2 className="text-2xl font-bold text-white mb-6">Credential Configuration</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">Issuer DID</label>
                                <input
                                    type="text"
                                    value="did:air:id:test:4P6qSxJfHHzNY4RoQSGenGoZpumYL1HspaZHeNjF5n"
                                    readOnly
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Credential ID</label>
                                <input
                                    type="text"
                                    value="c21s80g0h2r490096203zb"
                                    readOnly
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">JWT Algorithm</label>
                                <input
                                    type="text"
                                    value="RS256"
                                    readOnly
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">JWT Token Details</label>
                                <div className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black text-xs">
                                    {loginResult?.token ? (
                                        <div>
                                            <div className="font-semibold mb-2">✅ Using Login Result Token</div>
                                            {(() => {
                                                const jwtPayload = decodeJWT(loginResult.token);
                                                return (
                                                    <div>
                                                        <div className="mb-2">
                                                            <strong>Partner ID:</strong> {jwtPayload?.partnerId || 'Not found'}
                                                        </div>
                                                        <div className="mb-2">
                                                            <strong>User ID:</strong> {loginResult.id || 'Not found'}
                                                        </div>
                                                        <div className="mb-2">
                                                            <strong>Address:</strong> {loginResult.abstractAccountAddress || 'Not found'}
                                                        </div>
                                                        <div className="mb-2">
                                                            <strong>Token Type:</strong> {jwtPayload?.type || 'Not found'}
                                                        </div>
                                                        <div className="mb-2">
                                                            <strong>Expires:</strong> {jwtPayload?.exp ? new Date(jwtPayload.exp * 1000).toLocaleString() : 'Not found'}
                                                        </div>
                                                        <div className="mb-2">
                                                            <strong>Issued At:</strong> {jwtPayload?.iat ? new Date(jwtPayload.iat * 1000).toLocaleString() : 'Not found'}
                                                        </div>
                                                        <div className="break-all text-xs mt-2 p-2 bg-gray-100 rounded">
                                                            {loginResult.token}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="font-semibold mb-2 text-orange-600">⚠️ Using Fallback Token</div>
                                            <div className="break-all text-xs p-2 bg-gray-100 rounded">
                                                {getAuthToken()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credential Subject Panel */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                        <h2 className="text-2xl font-bold text-white mb-6">Credential Subject Data</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">Fan ID</label>
                                <input
                                    type="text"
                                    value={credentialSubject.credentialSubject.id}
                                    onChange={(e) => updateCredentialField('id', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Country</label>
                                <select
                                    value={credentialSubject.credentialSubject.country}
                                    onChange={(e) => updateCredentialField('country', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Gender</label>
                                <select
                                    value={credentialSubject.credentialSubject.gender}
                                    onChange={(e) => updateCredentialField('gender', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Fan Since</label>
                                <input
                                    type="date"
                                    value={credentialSubject.credentialSubject.fanSince}
                                    onChange={(e) => updateCredentialField('fanSince', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Verification Method</label>
                                <select
                                    value={credentialSubject.credentialSubject.verificationMethod}
                                    onChange={(e) => updateCredentialField('verificationMethod', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="social_media_analysis">Social Media Analysis</option>
                                    <option value="music_streaming_data">Music Streaming Data</option>
                                    <option value="concert_attendance">Concert Attendance</option>
                                    <option value="merchandise_purchases">Merchandise Purchases</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Social Media Engagement</label>
                                <select
                                    value={credentialSubject.credentialSubject.socialMediaEngagement}
                                    onChange={(e) => updateCredentialField('socialMediaEngagement', e.target.value)}
                                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="verified">Verified</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                    <div className="text-center">
                        <button
                            onClick={issueFanCredential}
                            disabled={isIssuing}
                            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${isIssuing
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg'
                                }`}
                        >
                            {isIssuing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Issuing Credential...</span>
                                </div>
                            ) : (
                                'Issue Fan Credential'
                            )}
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
                            <div className="text-red-300 font-semibold mb-2">Error:</div>
                            <div className="text-red-200">{error}</div>
                        </div>
                    )}

                    {/* Success Display */}
                    {credentialResult && (
                        <div className="mt-6 p-4 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg">
                            <div className="text-green-300 font-semibold mb-2">✅ Credential Issued Successfully!</div>
                            <div className="text-green-200 text-sm">
                                <pre className="whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(credentialResult, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* JSON Preview */}
                <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                    <h3 className="text-xl font-bold text-white mb-4">Credential Subject Preview</h3>
                    <div className="bg-black bg-opacity-50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm whitespace-pre-wrap">
                            {JSON.stringify(credentialSubject, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
