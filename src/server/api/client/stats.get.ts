export default definePermissionEventHandler('clients', 'view', async () => {
  const clientCount = await Database.clients.getAll().then(clients => clients.length);
  const maxClients = WG_ENV.MAX_USER_ACCOUNTS;

  return {
    currentClients: clientCount,
    maxClients: maxClients,
    canCreateMore: maxClients === 0 || clientCount < maxClients,
    unlimited: maxClients === 0,
    remaining: maxClients === 0 ? 0 : Math.max(0, maxClients - clientCount),
  };
}); 