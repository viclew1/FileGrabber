import React, { useEffect, useRef } from 'react';
import { Flex, FlexProps } from '@radix-ui/themes';

type FlexPropsWithoutDrag = Omit<FlexProps, 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'>;

export type DragNDropFlexProps = FlexPropsWithoutDrag & {
    onDragActiveChange?: (isDragActive: boolean) => void;
    onItemsDrop?: (files: File[]) => void;
};

export default function DragNDropFlex({ onDragActiveChange, onItemsDrop, ...props }: DragNDropFlexProps) {
    const dropRef = useRef<HTMLDivElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActiveChange?.(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
            onDragActiveChange?.(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragActiveChange?.(true);
    };

    useEffect(() => {
        const handleDrop = async (e: DragEvent) => {
            e.preventDefault();
            const dropZone = dropRef.current;
            if (!dropZone || !dropZone.contains(e.target as Node)) return;

            const files = [...(e.dataTransfer?.files ?? [])];
            const paths = await window.electronAPI.getFilesPaths(files);
            console.log(e, (e.dataTransfer as any).entries, files, paths);
            onDragActiveChange?.(false);
            onItemsDrop?.(files);
        };
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('drop', handleDrop);
        };
    }, []);
    return (
        <Flex
            ref={dropRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            {...props}
        />
    );
}
