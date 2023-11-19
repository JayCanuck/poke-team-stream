import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
// import { useEffect } from 'react';
import { useEffect, useMemo } from 'react';
import { CenterContent } from '../components/CenterContent';
// import { ReadyState, useConnection } from '../hooks/use-connection';

export interface ConnectProps {
  onLogin: () => void;
}

export const Connect: React.FC<ConnectProps> = ({ onLogin }) => {
  // const [{ readyState, error }, { connect }] = useConnection();
  const error = useMemo<Error | null>(() => null, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validate: values => {
      const errors: Partial<typeof values> = {};
      if (!values.username) errors.username = 'Username is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    },
    onSubmit: values => {
      console.log('onSubmit', values);
      onLogin();
      //connect('mygroupkey');
      //connect(values.username);
    }
  });

  useEffect(() => {
    if (error) formik.setSubmitting(false);
  }, [error, formik]);

  /*useEffect(() => {
    if (readyState === ReadyState.Connected) {
      console.log('login');
      formik.setSubmitting(false);
      onLogin();
    } else if (error && formik.isSubmitting) {
      console.log('login failed');
      formik.setSubmitting(false);
    }
  }, [error, formik, onLogin, readyState]);*/

  // todo: pokeball animation on connect attempt
  // todo: if has
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
