const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getDetailMusicByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusicByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteMusicByIdHandler,
  }
]

module.exports = routes
