import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ResendTimerProps {
    initialSeconds: number;
    onResend: () => void;
    disabled?: boolean;
}

/**
 * Resend Timer Component
 * 
 * Shows countdown and enables resend button when time expires
 */
export function ResendTimer({ initialSeconds, onResend, disabled = false }: ResendTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (secondsLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const handleResend = () => {
        setSecondsLeft(initialSeconds);
        setCanResend(false);
        onResend();
    };

    return (
        <div className="flex items-center justify-center gap-3">
            {!canResend && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            )}

            <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={!canResend || disabled}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 disabled:opacity-50"
            >
                {canResend ? 'Gửi lại mã' : 'Chưa thể gửi lại'}
            </Button>
        </div>
    );
}
