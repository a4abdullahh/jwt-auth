import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/api';
import queryClient from '../config/queryClient';

const UserMenu = () => {
  const navigate = useNavigate();

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  return (
    <Menu isLazy>
      <MenuButton position='absolute' right='1.5rem' top='1.5rem'>
        <Avatar src='#' />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/')}>Profile</MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
