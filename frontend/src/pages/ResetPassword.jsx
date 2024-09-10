import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../lib/api';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get('code');
  const expiration = searchParams.get('exp');
  const [isValid, setIsValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if the link is expired
    const expirationTime = parseInt(expiration, 10);
    const currentTime = Date.now();

    if (!verificationCode || !expirationTime || currentTime > expirationTime) {
      setIsValid(false);
    }
  }, [verificationCode, expiration]);

  const {
    mutate: reset,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: () =>
      resetPassword({
        verificationCode,
        password,
      }),
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (password === confirmPassword) {
      reset();
    } else {
      alert('Passwords do not match');
    }
  };

  if (isSubmitted) {
    return (
      <Flex minH='100vh' align='center' justify='center' bg='gray.800'>
        <Stack
          spacing={8}
          mx='auto'
          maxW='lg'
          py={12}
          px={6}
          textAlign='center'
        >
          <Heading fontSize='4xl' color='white'>
            Password Reset Successful
          </Heading>
          <Text color='gray.300'>
            Your password has been successfully reset. You can now{' '}
            <ChakraLink as={Link} to='/login'>
              log in
            </ChakraLink>{' '}
            with your new password.
          </Text>
        </Stack>
      </Flex>
    );
  }

  return (
    <Flex minH='100vh' align='center' justify='center' bg='gray.800'>
      <Stack spacing={8} mx='auto' maxW='lg' py={12} px={6}>
        <Stack align='center'>
          <Heading fontSize='4xl' color='white'>
            Reset Password
          </Heading>
        </Stack>

        {isValid ? (
          <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
            <Stack spacing={4}>
              {/* Password input */}
              <FormControl id='password' isRequired>
                <FormLabel color='gray.300'>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter new password'
                  />
                  <InputRightElement h='full'>
                    <Button
                      variant='ghost'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Confirm Password input */}
              <FormControl id='confirmPassword' isRequired>
                <FormLabel color='gray.300'>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                  />
                  <InputRightElement h='full'>
                    <Button
                      variant='ghost'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Submit button */}
              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isLoading}
                  isDisabled={!password || password !== confirmPassword}
                  loadingText='Resetting'
                  size='md'
                  colorScheme='teal'
                  onClick={handleSubmit}
                >
                  Reset Password
                </Button>

                {/* Error message */}
                {isError && (
                  <Text color='red.400' textAlign='center'>
                    {error?.message ||
                      'Failed to reset password. Please try again.'}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
            <Alert status='error'>
              <AlertIcon />
              <Text color='red.400' textAlign='center'>
                The reset link is invalid or has expired. Please request a new
                link.
              </Text>
            </Alert>
          </Box>
        )}
      </Stack>
    </Flex>
  );
};

export default ResetPassword;
