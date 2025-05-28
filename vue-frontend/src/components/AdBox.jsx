import React from 'react';

const AdBox = () => {
  // Mock ad data (equivalent to the data() function in Vue)
  const mockAd = {
    attributes: {
      title: 'Sample Ad',
      type: 'image', // Use 'video' if you want to test with videos
      contentUrl: {
        data: {
          attributes: {
            // Since the image is in public/HomeView, use an absolute path starting with '/'
            url: '/HomeView/adBox/сонячна-ферма.JPG',
          },
        },
      },
      link: 'https://example.com',
    },
  };

  // Helper functions (equivalent to methods in Vue)
  const getAdContentUrl = (ad) => {
    return ad.attributes.contentUrl.data.attributes.url;
  };

  const goToAdLink = () => {
    window.open(mockAd.attributes.link, '_blank');
  };

  return (
    <div className="ad-box" onClick={goToAdLink}>
      {mockAd.attributes.type === 'image' ? (
        <img src={getAdContentUrl(mockAd)} alt={mockAd.attributes.title} />
      ) : mockAd.attributes.type === 'video' ? (
        <video controls>
          <source src={getAdContentUrl(mockAd)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  );
};

// CSS for the component (you can either use a CSS module, styled-components, or inline styles)
// Here's the equivalent CSS using object style for React:
const styles = {
  adBox: {
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: '#e0f7fa',
    border: '1px solid #b2ebf2',
    position: 'relative',
    transition: 'transform 0.3s, box-shadow 0.3s',
    zIndex: 1,
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 4px 10px rgba(255, 0, 0, 0.2)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      transition: 'background-color 0.3s',
    },
    '&:hover::after': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
  },
  mediaContent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default AdBox;