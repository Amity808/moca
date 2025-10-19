'use client';

import { ReactNode } from 'react';

// Color palette based on music/entertainment theme
export const colors = {
    primary: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899', // Main pink
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
    },
    secondary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6', // Main purple
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
    },
    accent: {
        blue: '#3b82f6',
        green: '#10b981',
        yellow: '#f59e0b',
        red: '#ef4444',
    }
};

// Typography system
export const typography = {
    fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    }
};

// Button component variants
interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    className = ''
}: ButtonProps) => {
    const baseClasses = 'font-semibold rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white focus:ring-pink-500',
        secondary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500',
        outline: 'border-2 border-white text-white hover:bg-white hover:text-purple-900 focus:ring-white',
        ghost: 'text-white hover:bg-white hover:bg-opacity-10 focus:ring-white'
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Card component
interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'gradient';
    className?: string;
}

export const Card = ({ children, variant = 'default', className = '' }: CardProps) => {
    const baseClasses = 'rounded-xl p-6';

    const variantClasses = {
        default: 'bg-white bg-opacity-10 backdrop-blur-sm',
        glass: 'bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-20',
        gradient: 'bg-gradient-to-r from-pink-600 to-purple-600'
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );
};

// Badge component
interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) => {
    const baseClasses = 'font-semibold rounded-full';

    const variantClasses = {
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        default: 'bg-purple-500 text-white'
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm'
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {children}
        </span>
    );
};

// Progress bar component
interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'default' | 'gradient';
    className?: string;
}

export const ProgressBar = ({ value, max = 100, variant = 'default', className = '' }: ProgressBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);

    const baseClasses = 'w-full bg-gray-700 rounded-full h-2';

    const fillClasses = variant === 'gradient'
        ? 'bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300'
        : 'bg-pink-500 h-2 rounded-full transition-all duration-300';

    return (
        <div className={`${baseClasses} ${className}`}>
            <div
                className={fillClasses}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

// Input component
interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

export const Input = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    className = ''
}: InputProps) => {
    const baseClasses = 'w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all';

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseClasses} ${disabledClasses} ${className}`}
        />
    );
};

// Textarea component
interface TextareaProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export const Textarea = ({
    placeholder,
    value,
    onChange,
    rows = 4,
    disabled = false,
    className = ''
}: TextareaProps) => {
    const baseClasses = 'w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-vertical';

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            disabled={disabled}
            className={`${baseClasses} ${disabledClasses} ${className}`}
        />
    );
};

// Modal component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full ${sizeClasses[size]} bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6`}>
                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

// Loading spinner component
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`animate-spin ${sizeClasses[size]} border-4 border-pink-500 border-t-transparent rounded-full ${className}`}></div>
    );
};

// Fan score display component
interface FanScoreProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export const FanScore = ({ score, size = 'md', showLabel = true, className = '' }: FanScoreProps) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 80) return 'text-blue-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Elite Fan';
        if (score >= 80) return 'Super Fan';
        if (score >= 70) return 'Loyal Fan';
        return 'New Fan';
    };

    const sizeClasses = {
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-6xl'
    };

    return (
        <div className={`text-center ${className}`}>
            <div className={`${sizeClasses[size]} font-bold mb-2 ${getScoreColor(score)}`}>
                {score}
            </div>
            {showLabel && (
                <>
                    <div className="text-white mb-2">Fan Loyalty Score</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBadge(score)} text-white`}>
                        {getScoreLabel(score)}
                    </div>
                </>
            )}
        </div>
    );
};

