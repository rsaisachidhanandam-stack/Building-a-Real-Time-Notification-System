// Aggregate to find users with most playlists
const userActivityPipeline = [
  {
    $group: {
      _id: "$user",
      playlistCount: { $sum: 1 }
    }
  },
  {
    $sort: { playlistCount: -1 }
  },
  {
    $limit: 10
  }
];

module.exports = userActivityPipeline;
