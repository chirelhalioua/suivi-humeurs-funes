const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const humeurUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  humeurId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, default: 'Aucune description fournie' },
  date: { type: String, required: true },
  timeOfDay: { type: String, required: true },  // Ajout du champ `timeOfDay`
}, {
  timestamps: true
});

const HumeurUser = mongoose.model('HumeurUser', humeurUserSchema);

module.exports = HumeurUser;
