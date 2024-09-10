import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Flex,
  Link as ChakraLink,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  VStack,
  Button,
  Box,
  Heading,
} from '@chakra-ui/react';
import { verifyEmail } from '../lib/api';

const VerifyEmail = () => {
  const { code } = useParams();
  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ['emailVerification', code],
    queryFn: () => verifyEmail(code),
  });

  return (
    <Flex minH='100vh' justify='center' align='center' px={4}>
      <Container maxW='sm' p={8} boxShadow='lg' bg='gray.700' borderRadius='md'>
        <VStack spacing={6}>
          <Heading fontSize='2xl' color='gray.100' textAlign='center'>
            {isLoading
              ? 'Verifying your Email'
              : isSuccess
              ? 'Email Verified!'
              : 'Verification Failed'}
          </Heading>

          <Box>
            {isLoading ? (
              <VStack>
                <Spinner size='lg' color='purple.500' />
                <Text fontSize='md' color='gray.400'>
                  Please wait while we verify your email.
                </Text>
              </VStack>
            ) : (
              <>
                {isSuccess ? (
                  <Alert
                    status='success'
                    borderRadius='md'
                    variant='subtle'
                    bg='green.700'
                    color='gray.200'
                  >
                    <AlertIcon />
                    Your email has been successfully verified.
                  </Alert>
                ) : (
                  <Alert
                    status='error'
                    borderRadius='md'
                    variant='subtle'
                    bg='red.700'
                    color='gray.200'
                  >
                    <AlertIcon />
                    The link is either invalid or expired.
                  </Alert>
                )}
              </>
            )}
          </Box>

          {isError && (
            <Text fontSize='sm' color='gray.400'>
              The verification link is invalid or has expired.{' '}
              <ChakraLink as={Link} to='/password/reset' color='purple.400'>
                Request a new link
              </ChakraLink>
            </Text>
          )}

          <Button as={Link} to='/' width='full'>
            Go to Home
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
};

export default VerifyEmail;
