import { Frame, Modal, PageActions } from '@shopify/polaris';
import React from 'react';

const DeleteButtonModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <div style={{ height: '500px' }}>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={onClose}
                    title="Confirm Delete Review"
                >
                    <Modal.Section>
                        <div>
                            <p>
                                Are you sure you want to delete this review? This action cannot be undone.
                            </p>
                        </div>
                        <PageActions
                            primaryAction={{
                                content: 'Cancel',
                                onAction: onClose,
                            }}
                            secondaryActions={[
                                {
                                    content: 'Delete',
                                    destructive: true,
                                    onAction: onConfirm,
                                },
                            ]}
                        />
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
};

export default DeleteButtonModal;
