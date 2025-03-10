import { Modal, Text } from '@shopify/polaris';
import React from 'react';

const DeleteButtonModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Delete Review"
            primaryAction={{
                content: 'Delete',
                destructive: true,
                onAction: onConfirm
            }}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: onClose
                }
            ]}
        >
            <Modal.Section>
                <Text>Are you sure you want to delete this review?</Text>
            </Modal.Section>
        </Modal>
    );
};

export default DeleteButtonModal;
