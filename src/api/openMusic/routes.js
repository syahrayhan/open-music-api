const routes = (handler) => [
  {
    method: 'POST',
    path: '/openMusic',
    handler: handler.postMusicHandler,
  },
  {
    method: 'GET',
    path: '/openMusic',
    handler: handler.getAllMusicHandler,
  },
  {
    method: 'GET',
    path: '/openMusic',
    handler: handler.getDetailMusicByIdHandler,
  },
  {
    method: 'PUT',
    path: '/openMusic',
    handler: handler.putMusicByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/openMusic',
    handler: handler.deleteMusicByIdHandler,
  }
]

module.exports = routes
