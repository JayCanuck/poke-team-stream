import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { CenterContent } from '../components/CenterContent';
import { LOCALSTORAGE_NAME_KEY } from '../config';

export interface SubmitValues {
  name?: string;
  password?: string;
}

export interface ConnectProps {
  initial?: SubmitValues;
  error?: Error;
  onSubmit: (values: SubmitValues) => void;
}

export const Connect: React.FC<ConnectProps> = ({ initial, error, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      username: initial?.name || window.localStorage.getItem(LOCALSTORAGE_NAME_KEY) || '',
      password: initial?.password || ''
    },
    validate: values => {
      const errors: Partial<typeof values> = {};
      if (!values.username) errors.username = 'Username is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    },
    onSubmit: values => {
      onSubmit({ name: values.username, password: values.password });
    }
  });

  useEffect(() => {
    if (error) formik.setSubmitting(false);
  }, [error, formik]);

  return (
    <CenterContent>
      <Box width='250px' maxWidth='90%' pb={4}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id='username'
            name='username'
            label='Twitch Username'
            margin='dense'
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={(formik.touched.username && formik.errors.username) || ' '}
            disabled={formik.isSubmitting}
          />
          <TextField
            fullWidth
            id='password'
            name='password'
            label='Password'
            type='password'
            margin='dense'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={(formik.touched.password && formik.errors.password) || ' '}
            disabled={formik.isSubmitting}
          />
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting} sx={{ mt: 1 }}>
            Connect
          </Button>
          {error && <FormHelperText error>Error: {error.message}</FormHelperText>}
        </form>
      </Box>
    </CenterContent>
  );
};
