import { Box, Text, Alert, AlertIcon, Stack, Heading } from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box maxW='md' mx='auto' p={10}>
      <Stack spacing={4}>
        <Heading mb={6}>My Profile</Heading>

        {/* Display user email */}
        <Text fontSize='lg'>
          <strong>Email: </strong>
          {user.email}
        </Text>

        {/* Display user created at */}
        <Text fontSize='lg'>
          <strong>Created At: </strong>
          {new Date(user.createdAt).toLocaleDateString('en-US')}
        </Text>

        {/* Show alert if the user is not verified */}
        {!user.verified && (
          <Alert status='warning'>
            <AlertIcon />
            Your email is not verified. Please verify your email to unlock all
            features.
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default Profile;
