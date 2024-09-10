import { Spinner, Box, Text, Stack, Heading } from '@chakra-ui/react';
import useSessions from '../hooks/useSessions';
import SessionCard from '../components/SessionCard';

const Settings = () => {
  const { sessions, isPending } = useSessions();

  return (
    <Box maxW='md' mx='auto' p={5}>
      <Heading mb={6}>My Sessions</Heading>
      {isPending ? (
        <Spinner size='lg' />
      ) : (
        <Stack spacing={3}>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))
          ) : (
            <Text>No active sessions found.</Text>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Settings;
