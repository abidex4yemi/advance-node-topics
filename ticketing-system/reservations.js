const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./data-reservations');

const loadReservations = () =>
  JSON.parse(localStorage.getItem('reservations') || '{}');
const saveReservations = (reservations) =>
  localStorage.setItem('reservations', JSON.stringify(reservations, null, 2));

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.delete('/cancel', (req, res) => {
  const reservations = loadReservations();

  const { showID, name } = req.body;

  const reservation = reservations[showID].find(
    (reservation) => reservation.name === name
  );

  reservations[showID] = reservations[showID].filter(
    (reservation) => reservation.name !== name
  );

  saveReservations(reservations);
  return res.json({ canceled: true, showID, ...reservation });
});

app.post('/reserveTickets', (req, res) => {
  const reservations = loadReservations();

  const shows = loadShows();

  let count;

  if (!req.body.count) {
    res.status(500);
    return res.json({
      error: `A ticket count is required to reserve tickets.`
    });
  }

  if (!req.body.name) {
    res.status(500);
    return res.json({ error: `A name is required to reserve tickets.` });
  }

  count = parseInt(req.body.count);

  show = shows.find((s) => s._id === req.body.showID);

  if (!show) {
    res.status(500);
    return res.json({
      error: `Cannot find show with id: ${req.body.showID}`
    });
  }

  const remainingSeats = show.houseSize - show.reserved;

  if (remainingSeats < count) {
    res.status(500);
    return res.json({
      error: `cannot reserve ${count} seats. Only ${remainingSeats} remaining.`
    });
  }

  let list = reservations[req.body.showID];

  let reservation = { name: req.body.name, guests: req.body.count };

  if (!list) {
    reservations[req.body.showID] = [];
  }
  reservations[req.body.showID].push(reservation);

  show.reserved += count;

  saveReservations(reservations);

  saveShows(shows);

  return res.json({ success: true, showID: req.body.showID, ...reservation });
});

app.get('/reservations/:showID', (req, res) => {
  const reservations = loadReservations();
  res.json(reservations[req.params.showID] || []);
});

app.get('/', (req, res) => {
  const reservations = loadReservations();
  return res.json({ reservations });
});

app.listen(3002, () => console.log(`Reservation service running on port 3002`));
