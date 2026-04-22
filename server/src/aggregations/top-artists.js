// Aggregate to find most popular artists by number of songs
const topArtistsPipeline = [
  {
    $group: {
      _id: "$artist",
      totalSongs: { $sum: 1 }
    }
  },
  {
    $sort: { totalSongs: -1 }
  },
  {
    $limit: 10
  }
];

module.exports = topArtistsPipeline;
