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
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../lib/api';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectUrl = location.state?.redirectUrl || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mutation for login API call
  const {
    mutate: signIn,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, { replace: true });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleSubmit = () => {
    signIn({ email, password });
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign into your account
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
            </FormControl>

            {/* Forgot password link */}
            <Stack spacing={10}>
              <ChakraLink
                as={Link}
                fontSize='sm'
                textAlign={{ base: 'center', sm: 'right' }}
                to='/password/forgot'
              >
                Forgot Password?
              </ChakraLink>
            </Stack>

            {/* Submit button */}
            <Stack spacing={10} pt={2}>
              <Button
                isLoading={isLoading}
                isDisabled={!email || password.length < 6}
                loadingText='Signing in'
                size='md'
                colorScheme='teal'
                onClick={handleSubmit}
              >
                Sign in
              </Button>

              {/* Error message */}
              {isError && (
                <Text color='red.500' textAlign='center'>
                  {error?.message || 'Login failed'}
                </Text>
              )}
            </Stack>

            {/* Sign up link */}
            <Stack pt={2}>
              <Text align={'center'} color='text.muted' fontSize='sm'>
                Don&apos;t have an account?{' '}
                <ChakraLink as={Link} to='/register'>
                  Sign Up
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
