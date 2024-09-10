import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  FormHelperText,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutation for register API call
  const {
    mutate: signUp,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/', { replace: true });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleSubmit = () => {
    if (password === confirmPassword) {
      signUp({ email, password, confirmPassword });
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Create your account
          </Heading>
        </Stack>

        <Box rounded={'lg'} bg={'gray.700'} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            {/* Email input */}
            <FormControl id='email' isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            {/* Password input */}
            <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color='gray.400'>
                Password must be at least 6 characters.
              </FormHelperText>
            </FormControl>

            {/* Confirm Password input */}
            <FormControl id='confirmPassword' isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                isDisabled={
                  !email || password.length < 6 || password !== confirmPassword
                }
                loadingText='Signing up'
                size='md'
                colorScheme='teal'
                onClick={handleSubmit}
              >
                Sign up
              </Button>

              {/* Error message */}
              {isError && (
                <Text color='red.500' textAlign='center'>
                  {error?.response?.data?.message || 'Registration failed'}
                </Text>
              )}
            </Stack>

            {/* Sign in link */}
            <Stack pt={2}>
              <Text align={'center'} color='text.muted' fontSize='sm'>
                Already have an account?{' '}
                <ChakraLink as={Link} to='/login'>
                  Sign In
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
