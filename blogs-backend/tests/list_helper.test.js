const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy always returns 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('multiple blogs', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 4
      },
      {
        title: 'mrekk pp record',
        author: 'Matchi',
        likes: 5,
      },
      {
        title: 'gnahus liveplay',
        author: 'gnahus',
        likes: 11
      },
      {
        title: 'lifeline pop off',
        author: 'Matchi',
        likes: 8
      },
      {
        title: 'get real',
        author: 'Edsger W. Dijkstra',
        likes: 7
      },
      {
        title: 'akolibed pp record (if ranked)',
        author: 'Matchi',
        likes: 10
      },
    ]

    assert.deepStrictEqual(listHelper.totalLikes(blogs), 45)
  })

  test('one blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]

    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('no blogs', () => {
    const listWithNoBlogs = []

    assert.strictEqual(listHelper.totalLikes(listWithNoBlogs), 0)
  })
})

describe('favorite blog', () => {
  test('multiple blogs', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      },
      {
        title: 'mrekk pp record',
        author: 'Matchi',
        likes: 15
      },
      {
        title: 'gnahus liveplay',
        author: 'gnahus',
        likes: 5
      }
    ]

    assert.deepStrictEqual(listHelper.favoriteBlog(blogs),
      {
        title: 'mrekk pp record',
        author: 'Matchi',
        likes: 15
      }
    )

  })

  test('one blog', () => {
    const listWithOneBlog = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    ]

    assert.deepEqual(listHelper.favoriteBlog(listWithOneBlog),
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    )
  })
})

describe('most blogs', () => {
  test('multiple blogs', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 4
      },
      {
        title: 'mrekk pp record',
        author: 'Matchi',
        likes: 5,
      },
      {
        title: 'gnahus liveplay',
        author: 'gnahus',
        likes: 11
      },
      {
        title: 'lifeline pop off',
        author: 'Matchi',
        likes: 8
      },
      {
        title: 'get real',
        author: 'Edsger W. Dijkstra',
        likes: 7
      },
      {
        title: 'akolibed pp record (if ranked)',
        author: 'Matchi',
        likes: 10
      },
    ]

    assert.deepStrictEqual(listHelper.mostBlogs(blogs),
      {
        author: 'Matchi',
        blogs: 3
      }
    )
  })

  test('list with one blog', () => {
    const listWithOneBlog = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 4
      }
    ]

    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog),
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })
})

describe('most liked', () => {
  test('multiple blogs', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 4
      },
      {
        title: 'mrekk pp record',
        author: 'Matchi',
        likes: 5,
      },
      {
        title: 'gnahus liveplay',
        author: 'gnahus',
        likes: 11
      },
      {
        title: 'lifeline pop off',
        author: 'Matchi',
        likes: 8
      },
      {
        title: 'get real',
        author: 'Edsger W. Dijkstra',
        likes: 7
      },
      {
        title: 'akolibed pp record (if ranked)',
        author: 'Matchi',
        likes: 10
      },
    ]

    assert.deepStrictEqual(listHelper.mostLikes(blogs),
      {
        author: 'Matchi',
        likes: 23
      })
  })

  test('list with one blog', () => {
    const listWithOneBlog = [
      {
        title: 'gnahus liveplay',
        author: 'gnahus',
        likes: 11
      }
    ]

    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog),
      {
        author: 'gnahus',
        likes: 11
      })
  })
})