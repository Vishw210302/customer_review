import { Button } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import AddReviewModal from './modals/AddReviewModal';
import DeleteButtonModal from './modals/DeleteButtonModal';
import { useLoaderData } from '@remix-run/react';

function CustomerReviewsManager() {

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const data = useLoaderData()
  
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "John Smith",
      product: "Emerald Silk Gown",
      email: "vishwprajapati66@gmail.com",
      mobileNumber: "9173211901",
      rating: "Very Poor",
      date: "2025-01-15",
      comment: "Beautiful fabric and excellent craftsmanship. Sizing runs slightly small.",
      verified: true
    },
    {
      id: 2,
      customer: "Maria Garcia",
      product: "Mauve Cashmere Scarf",
      email: "vishwprajapati66@gmail.com",
      mobileNumber: "9173211901",
      rating: "Poor",
      date: "2025-01-20",
      comment: "Incredibly soft and luxurious. Worth every penny!",
      verified: true
    },
    {
      id: 3,
      customer: "David Wong",
      product: "Cobalt Leather Wallet",
      email: "vishwprajapati66@gmail.com",
      mobileNumber: "9173211901",
      rating: "Average",
      date: "2025-01-22",
      comment: "Good quality but the color was different than pictured.",
      verified: false
    }
  ]);

  const handleDeleteModalOpen = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteReview = () => {
    if (selectedReviewId) {
      setReviews(reviews.filter(review => review.id !== selectedReviewId));
      setDeleteModalOpen(false);
    }
  };

  const addReview = (newReview) => {
    setReviews([...reviews, {
      id: reviews.length + 1,
      verified: Math.random() > 0.3,
      ...newReview
    }]);
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Excellent':
        return '#2E7D32';
      case 'Good':
        return '#1976D2';
      case 'Average':
        return '#FF8F00';
      case 'Poor':
        return '#D32F2F';
      case 'Very Poor':
        return '#ff0000';
      default:
        return '#1976D2';
    }
  };

  const getTimeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1280px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      marginBottom: '32px',
      border: '1px solid rgba(0,0,0,0.05)'
    },
    header: {
      background: 'linear-gradient(135deg, #000000 0%, #0171e1 100%)',
      padding: '32px',
      color: 'white',
      position: 'relative'
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px'
    },
    headerSubtitle: {
      margin: '0',
      opacity: '0.9',
      maxWidth: '600px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    addButton: {
      backgroundColor: 'white',
      color: '#3498db',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 28px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableContainer: {
      maxHeight: '650px',
      overflowY: 'auto',
      padding: '0 16px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#d1d5db #f5f7fa'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 4px',
      fontSize: '14px',
      marginTop: '8px',
      marginBottom: '8px'
    },
    tableHeader: {
      position: 'sticky',
      top: '0',
      backgroundColor: 'white',
      zIndex: '1',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      height: '60px'
    },
    tableHeaderCell: {
      padding: '16px',
      textAlign: 'center',
      color: '#4a5568',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      backgroundColor: 'white',
      borderBottom: '2px solid #edf2f7',
      textTransform: 'uppercase',
      fontSize: '12px',
      letterSpacing: '1px'
    },
    emptyState: {
      padding: '64px 16px',
      textAlign: 'center',
      color: '#718096',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      margin: '24px 0'
    },
    emptyStateIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      color: '#a0aec0'
    },
    emptyStateTitle: {
      fontWeight: '600',
      marginBottom: '12px',
      fontSize: '20px',
      color: '#4a5568'
    },
    emptyStateText: {
      fontSize: '14px',
      maxWidth: '400px',
      margin: '0 auto'
    },
    tableRow: (isEven) => ({
      backgroundColor: isEven ? 'white' : '#f8fafc',
      transition: 'all 0.2s ease',
      borderRadius: '8px',
      marginBottom: '8px'
    }),
    tableCell: {
      padding: '20px 16px',
      textAlign: 'center',
      borderTop: '1px solid #edf2f7',
      borderBottom: '1px solid #edf2f7',
      verticalAlign: 'middle'
    },
    tableCellFirst: {
      padding: '20px 16px',
      textAlign: 'center',
      borderTop: '1px solid #edf2f7',
      borderBottom: '1px solid #edf2f7',
      borderLeft: '1px solid #edf2f7',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      verticalAlign: 'middle'
    },
    tableCellLast: {
      padding: '20px 16px',
      textAlign: 'center',
      borderTop: '1px solid #edf2f7',
      borderBottom: '1px solid #edf2f7',
      borderRight: '1px solid #edf2f7',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      verticalAlign: 'middle'
    },
    customerCell: {
      fontWeight: '600',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    productCell: {
      color: '#4299e1',
      fontWeight: '500',
      fontSize: '14px',
      maxWidth: '150px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    ratingBadge: (rating) => ({
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: `${getRatingColor(rating)}15`,
      color: getRatingColor(rating),
      fontWeight: '600',
      fontSize: '13px'
    }),
    dateCell: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      alignItems: 'center'
    },
    dateMain: {
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '14px'
    },
    dateAgo: {
      color: '#718096',
      fontSize: '12px'
    },
    commentContainer: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #edf2f7',
      position: 'relative',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#4a5568',
      maxWidth: '300px',
      margin: '0 auto'
    },
    verificationBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#48bb78',
      fontWeight: '500',
      marginTop: '4px'
    },
    unverifiedBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#a0aec0',
      fontWeight: '500',
      marginTop: '4px'
    }
  };

  const columns = [
    { key: 'customer', label: 'Reviewer' },
    { key: 'product', label: 'Product' },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile Number' },
    { key: 'rating', label: 'Rating' },
    { key: 'date', label: 'Date' },
    { key: 'comment', label: 'Review' },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Customer Reviews Dashboard</h1>
            <p style={styles.headerSubtitle}>
              Monitor customer feedback and gain insights to improve your products and services
            </p>
            <div style={{
              position: 'absolute',
              right: '32px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <button
                onClick={() => setModalOpen(true)}
                style={styles.addButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <span style={{ fontSize: '18px' }}>+</span> Add Review
              </button>
            </div>
          </div>

          <div style={styles.tableContainer}>
            {reviews.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>📝</div>
                <div style={styles.emptyStateTitle}>No reviews found</div>
                <div style={styles.emptyStateText}>
                  Be the first to add a customer review and start gathering valuable feedback
                </div>
              </div>
            ) : (
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={column.key}
                        style={{
                          ...styles.tableHeaderCell,
                          textAlign: column.key === 'comment' ? 'left' : 'center',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: column.key === 'comment' ? 'flex-start' : 'center',
                          alignItems: 'center'
                        }}>
                          {column.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr
                      key={review.id}
                      style={styles.tableRow(index % 2 === 0)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#edf2f7';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <td style={styles.tableCellFirst}>
                        <div style={styles.customerCell}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#4a5568'
                          }}>
                            {review.customer.charAt(0)}
                          </div>
                          <div>{review.customer}</div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <div style={styles.productCell} title={review.product}>
                            {review.product}
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{
                          fontSize: '13px',
                          color: '#4a5568',
                          wordBreak: 'break-all'
                        }}>
                          {review.email}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{
                          fontSize: '13px',
                          color: '#4a5568'
                        }}>
                          {review.mobileNumber}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.ratingBadge(review.rating)}>
                          {review.rating}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.dateCell}>
                          <div style={styles.dateMain}>
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div style={styles.dateAgo}>
                            {getTimeAgo(review.date)}
                          </div>
                        </div>
                      </td>
                      <td style={{
                        ...styles.tableCell,
                        textAlign: 'left',
                        maxWidth: '300px',
                      }}>
                        <div style={styles.commentContainer}>
                          <div style={{
                            position: 'absolute',
                            left: '10px',
                            top: '-10px',
                            color: '#cbd5e0',
                            fontSize: '24px',
                            transform: 'rotate(180deg)'
                          }}>
                            "
                          </div>
                          {review.comment}
                          <div style={{
                            position: 'absolute',
                            right: '10px',
                            bottom: '-10px',
                            color: '#cbd5e0',
                            fontSize: '24px'
                          }}>
                            "
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCellLast}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          <Button
                            onClick={() => handleDeleteModalOpen(review.id)}
                            icon={DeleteIcon}
                            size='large'
                            tone='critical'
                            accessibilityLabel={`Delete review by ${review.customer}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddReviewModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onAddReview={addReview}
      />

      <DeleteButtonModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirmDelete={handleDeleteReview}
      />
    </>
  );
}

export default CustomerReviewsManager;