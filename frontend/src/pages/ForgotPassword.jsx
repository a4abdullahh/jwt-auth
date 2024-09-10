import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { sendPasswordResetEmail } from '../lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    mutate: requestResetLink,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: () => sendPasswordResetEmail(email),
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (email) {
      requestResetLink();
    }
  };

  return (
    <Flex minH='100vh' align='center' justify='center' bg='gray.800'>
      <Stack spacing={8} mx='auto' maxW='lg' py={12} px={6}>
        <Stack align='center'>
          <Heading fontSize='4xl' color='white'>
            Forgot Password
          </Heading>
          <Text fontSize='lg' color='gray.400'>
            Enter your email to receive a password reset link.
          </Text>
        </Stack>

        {isSubmitted ? (
          <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
            <Text fontSize='lg' color='green.400' textAlign='center'>
              A password reset link has been sent to your email.
            </Text>
            <Stack pt={4} align='center'>
              <ChakraLink as={Link} to='/login'>
                Go to Sign In
              </ChakraLink>
            </Stack>
          </Box>
        ) : (
          <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
            <Stack spacing={4}>
              {/* Email input */}
              <FormControl id='email' isRequired>
                <FormLabel color='gray.300'>Email address</FormLabel>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='johndoe@example.com'
                />
              </FormControl>

              {/* Submit button */}
              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isLoading}
                  isDisabled={!email}
                  loadingText='Submitting'
                  size='md'
                  colorScheme='teal'
                  onClick={handleSubmit}
                >
                  Send Reset Link
                </Button>

                {/* Error message */}
                {isError && (
                  <Text color='red.400' textAlign='center'>
                    There was an error sending the reset link.{' '}
                    {error?.message || 'Please try again.'}
                  </Text>
                )}
              </Stack>

              {/* Sign in link */}
              <Stack pt={2}>
                <Text align='center' color='gray.400' fontSize='sm'>
                  Remembered your password?{' '}
                  <ChakraLink as={Link} to='/login'>
                    Sign In
                  </ChakraLink>
                </Text>
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;
