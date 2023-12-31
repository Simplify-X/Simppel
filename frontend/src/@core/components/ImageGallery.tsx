
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook';
import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Paper, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { styled } from '@mui/material/styles';
import moment from 'moment';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden'
}));


const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '20px',
  '&:last-of-type': {
    borderBottom: 'none',
  },
}));

const StyledFileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const ImageGallery = ({ advertisementId }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const { get } = useCustomApiHook();

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await get(`/getImages/fetch/${advertisementId}`);
        setImageUrls(response?.data.resources);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [advertisementId]);

  const handleDownload = (imageUrl, index) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Image_${index}.jpg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => console.error('Could not download the image'));
  };

  return (
    <Grid item xs={12}>
      <StyledPaper>
        <List dense>
          {imageUrls.map((image, index) => (
            <StyledListItem key={index}>
              <StyledFileIcon />
              <ListItemText
                primary={`Image ${index}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Created: {moment(image.created_at).format('DD/MM/YYYY')}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textPrimary">
                      Size: {formatBytes(image.bytes)}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Image">
                  <IconButton edge="end" onClick={() => window.open(image.url, '_blank')}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download Image">
                  <IconButton
                    edge="end"
                    onClick={() => handleDownload(image.url, index)}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </StyledListItem>
          ))}
        </List>
      </StyledPaper>
    </Grid>
  );
};

export default ImageGallery;





