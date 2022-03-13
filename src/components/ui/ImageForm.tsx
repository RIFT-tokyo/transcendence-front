/* eslint-disable jsx-a11y/label-has-associated-control */
import { VFC } from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface Props {
  saveImage: any // (fileName: Blob) => Promise<void> // callback taking a string and then dispatching a store actions
  profileImageURL: string | undefined
}

const ImageForm: VFC<Props> = ({ saveImage, profileImageURL }: Props) => {
  const handleCapture = ({ target }: any) => {
    saveImage(target.files[0]);
  };

  return (
    <>
      <input
        accept="image/jpeg, image/png, image/jpg, image/gif"
        id="profileImage"
        style={{ display: 'none' }}
        type="file"
        onChange={handleCapture}
      />
      <Avatar sx={{ width: 296, height: 296 }} src={profileImageURL} />
        <Tooltip title="Select Image">
          <label htmlFor="profileImage">
            <IconButton
              aria-label="upload picture"
              component="span"
            >
              <PhotoCameraIcon fontSize="large" />
            </IconButton>
          </label>
        </Tooltip>
    </>
  );
};

export default ImageForm;
