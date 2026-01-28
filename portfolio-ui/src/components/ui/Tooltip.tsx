import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: { bottom: '100%', left: '50%', x: '-50%', y: -10 },
        bottom: { top: '100%', left: '50%', x: '-50%', y: 10 },
        left: { right: '100%', top: '50%', y: '-50%', x: -10 },
        right: { left: '100%', top: '50%', y: '-50%', x: 10 },
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, ...positions[side] }}
                        animate={{ opacity: 1, scale: 1, ...positions[side] }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 px-3 py-2 text-xs font-medium text-white bg-black rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
                    >
                        {content}
                        <div
                            className={`absolute w-2 h-2 bg-black transform rotate-45 ${side === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                                    side === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                                        side === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                                            'left-[-4px] top-1/2 -translate-y-1/2'
                                }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
