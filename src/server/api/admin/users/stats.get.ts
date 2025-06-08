export default definePermissionEventHandler('users', 'view', async () => {
  const clientCount = await Database.clients.getAll().then(clients => clients.length);
  const maxUsers = WG_ENV.MAX_USER_ACCOUNTS;
  
  return {
    currentClients: clientCount,
    maxClients: maxUsers,
    canCreateMore: maxUsers === 0 || clientCount < maxUsers,
  };
}); 