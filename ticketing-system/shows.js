const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./data-shows');

const loadShows = () => JSON.parse(localStorage.getItem('shows') || '[]');

const saveShows = (shows) =>
  localStorage.setItem('shows', JSON.stringify(shows, null, 2));

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.put('/release-seats', (req, res) => {
  let show,
    count,
    shows = loadShows();

  if (!req.body.showID || !req.body.count) {
    return res.status(500).json({
      error: 'A showID and count are required to release seats'
    });
  }

  count = parseInt(req.body.count);

  show = shows.find((s) => s._id === req.body.showID);

  if (!show) {
    return res
      .status(404)
      .json({ error: `Cannot find show with id: ${req.body.showID}` });
  }

  show.reserved -= count;

  if (show.reserved < 0) {
    show.reserved = 0;
  }

  saveShows(shows);

  return res.status(200).json(show);
});

app.put('/hold-seats', (req, res) => {
  let show,
    count,
    shows = loadShows();

  if (!req.body.showID || !req.body.count) {
    return res
      .status(500)
      .json({ error: 'A showID and count are required to hold seats' });
  }

  count = parseInt(req.body.count);

  show = shows.find((s) => s._id === req.body.showID);

  if (!show) {
    return res
      .status(404)
      .json({ error: `Cannot find show with id: ${req.body.showID}` });
  }

  const remainingSeats = show.houseSize - show.reserved;

  if (remainingSeats < count) {
    res.status(500);
    return res.json({
      error: `cannot reserve ${count} seats. Only ${remainingSeats} remaining.`
    });
  }

  show.reserved += count;

  saveShows(shows);

  return res.json(show);
});

app.get('/show/:id', (req, res) => {
  const shows = loadShows();
  const show = shows.find((show) => show._id === req.params.id);
  res.json(show);
});

app.get('/', (req, res) => {
  const shows = loadShows();
  return res.status(200).json({ shows });
});

app.listen(3001, () => console.log(`Show service running on port 3000`));
