const express = require('express')
const { Liquid } = require('liquidjs')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// Liquid setup
const engine = new Liquid({
  root: path.resolve(__dirname, 'views'),
  extname: '.liquid'
})
app.engine('liquid', engine.express()) 
app.set('views', './views')
app.set('view engine', 'liquid')

// Static bestanden
app.use(express.static('public'))
app.use('/assets', express.static('assets'))
app.use('/images', express.static('assets/images'))

// Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// JSON data
const blogData = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'))

// === Routes ===
// Login GET
app.get('/', (req, res) => {
  res.render('login', { title: 'Login' })
})
//Login POST
app.post('/login', (req, res) => {
  const { name, email } = req.body
  const userData = { name, email }
  const usersPath = './data/users.json'
  let users = []
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))
  }
  users.push(userData)
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
  res.redirect(`/landing?name=${encodeURIComponent(name)}`)
})

// Landingspagina GET
app.get('/landing', (req, res) => {
  const name = req.query.name || 'guest'
  res.render('partials/layout', {
    title: 'Landing',
    includeContent: 'partials/landing-content',
    name: name
  })
})

// Blogpagina
app.get('/blog', (req, res) => {
  res.render('partials/layout', {
    title: 'Blog',
    includeContent: 'blog-content',
    posts: blogData.data
  })
})

// Blogpost
app.get('/:slug', (req, res) => {
  const slug = req.params.slug
  const blog = blogData.data.find(post => post.slug === slug)
  if (blog) {
    res.render('partials/layout', {
      title: blog.title,
      includeContent: 'article-content',
      blog: blog
    })
  } else {
    res.status(404).send('Blog not found')
  }
})

// Favorites pagina
app.get('/favorites', (req, res) => {
  res.render('partials/layout', {
    title: 'Favorites',
    includeContent: 'favorites-content',
  })
})

app.set('port', process.env.PORT || 2000)
app.listen(app.get('port'), () => {
  console.log(`Server started on http://localhost:${app.get('port')}`)
})
