import { Box, Text, Button, Stack, Badge, Divider } from '@chakra-ui/react';
import useDeleteSession from '../hooks/useDeleteSession';

/* eslint-disable react/prop-types */
const SessionCard = ({ session }) => {
  const { _id, createdAt, userAgent, isActive } = session;
  const { deleteSession } = useDeleteSession(_id);

  return (
    <Box
      p={6}
      borderWidth={2}
      borderRadius='lg'
      borderColor={isActive ? 'green.400' : 'gray.200'}
      boxShadow='md'
      bg='gray.700'
      position='relative'
      mb={6}
    >
      <Stack spacing={4}>
        {isActive && (
          <Badge
            colorScheme='green'
            position='absolute'
            top={2}
            right={2}
            fontSize='0.9em'
          >
            Active
          </Badge>
        )}

        <Text fontSize='lg' fontWeight='bold'>
          Session Information
        </Text>

        <Divider />

        <Text fontSize='md'>
          <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}
        </Text>

        <Text fontSize='md'>
          <strong>User Agent:</strong> {userAgent}
        </Text>

        <Divider />

        {!isActive && (
          <Button colorScheme='red' size='md' mt={4} onClick={deleteSession}>
            Delete Session
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default SessionCard;
