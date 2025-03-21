/* import { useActionData, useNavigation } from '@remix-run/react';
import {
    Button,
    ButtonGroup,
    Form,
    FormLayout,
    Frame,
    Icon,
    Modal,
    RadioButton,
    Text,
    TextField,
    Toast
} from '@shopify/polaris';
import {
    ThumbsDownIcon,
    ThumbsUpIcon
} from '@shopify/polaris-icons';
import { useState } from 'react';

const AddReviewModal = ({ isOpen, onClose, setModalOpen }) => {

    const actionData = useActionData();
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
    });
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [productId, setProductId] = useState('');
    const [recommend, setRecommend] = useState(null);
    const [errors, setErrors] = useState({});
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);
    const ratingLabels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
    const isSubmitting = navigation.state === "submitting";

    const handleActionResult = (result) => {
        if (result?.success) {
            setToastMessage('Review submitted successfully!');
            setToastError(false);
            resetForm();
            setTimeout(() => {
                onClose();
            }, 1000);
        } else if (result) {
            setToastMessage(result.message || 'Failed to submit review');
            setToastError(true);
            if (result.errors) {
                setErrors(result.errors);
            }
        }
        setToastActive(true);
    }

    if (actionData && !toastActive) {
        handleActionResult(actionData);
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }
        if (rating === 0) newErrors.rating = 'Please select a rating';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
        });
        setRating(0);
        setReviewText('');
        setProductId('');
        setRecommend(null);
        setErrors({});
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (validateForm()) {
            const formDataa = new FormData()
            formDataa.append('email', formData.email)
            formDataa.append('mobile', formData.mobile)
            formDataa.append('name', formData.name)
            formDataa.append('rating', rating)
            formDataa.append('recommend', recommend !== null ? recommend.toString() : '')
            formDataa.append('reviewText', reviewText)
            formDataa.append('productId', productId)

            try {
                const response = await fetch('https://247b-106-215-39-79.ngrok-free.app/api/addReview', {
                    method: 'POST',
                    body: formDataa,
                });
                resetForm();
                setModalOpen(false);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                await response.json();

            } catch (error) {
                console.error('Error submitting data:', error);
            }
        }
    };

    return (
        <Frame>
            {toastActive && (
                <Toast
                    content={toastMessage}
                    error={toastError}
                    onDismiss={() => setToastActive(false)}
                    duration={4000}
                />
            )}

            <Modal
                open={isOpen}
                onClose={onClose}
                title="Add Product Review"
                primaryAction={{
                    content: 'Submit Review',
                    onAction: handleSubmit,
                    loading: isSubmitting,
                    disabled: isSubmitting,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: onClose,
                        disabled: isSubmitting,
                    },
                ]}
            >
                <Modal.Section>

                    <Form method="post" onSubmit={handleSubmit}>
                        <input type="hidden" name="productId" value={productId} />
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(value) => handleInputChange('name', value)}
                                    autoComplete="name"
                                    error={errors.name}
                                    requiredIndicator
                                    disabled={isSubmitting}
                                />
                                <TextField
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    autoComplete="email"
                                    error={errors.email}
                                    requiredIndicator
                                    disabled={isSubmitting}
                                />
                            </FormLayout.Group>

                            <div>
                                <TextField
                                    type="tel"
                                    label="Phone Number (Optional)"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={(value) => handleInputChange('mobile', value)}
                                    autoComplete="tel"
                                    helpText="We'll only contact you if we need more information"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <TextField
                                    type="text"
                                    label="Product Id"
                                    name="productId"
                                    value={productId}
                                    onChange={setProductId}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Text variant="headingMd">Your Rating</Text>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {ratingLabels.map((label, index) => (
                                        <RadioButton
                                            key={index}
                                            label={label}
                                            checked={rating === index + 1}
                                            onChange={() => setRating(index + 1)}
                                            id={`rating-${index + 1}`}
                                            name="rating"
                                            value={index + 1}
                                            disabled={isSubmitting}
                                        />
                                    ))}
                                </div>
                                {errors.rating && <Text color="critical">{errors.rating}</Text>}
                            </div>

                            <div>
                                <TextField
                                    label="Write Your Review (Optional)"
                                    name="reviewText"
                                    value={reviewText}
                                    onChange={setReviewText}
                                    multiline={4}
                                    placeholder="Share your experience with this product..."
                                    showCharacterCount
                                    maxLength={500}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>

                                <Text variant="headingMd">Would you recommend this product?</Text>
                                <input type="hidden" name="recommend" value={recommend !== null ? recommend.toString() : ''} />

                                <ButtonGroup segmented fullWidth>

                                    <Button
                                        pressed={recommend === true}
                                        onClick={() => setRecommend(true)}
                                        disabled={isSubmitting}
                                        type="button"
                                    >
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            Yes
                                            <Icon source={ThumbsUpIcon} />
                                        </div>
                                    </Button>

                                    <Button
                                        pressed={recommend === false}
                                        onClick={() => setRecommend(false)}
                                        disabled={isSubmitting}
                                        type="button"
                                    >
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            No
                                            <Icon source={ThumbsDownIcon} />
                                        </div>
                                    </Button>

                                </ButtonGroup>

                            </div>

                        </FormLayout>
                    </Form>

                </Modal.Section>
            </Modal>
        </Frame>
    );
};

export default AddReviewModal; */