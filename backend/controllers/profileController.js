export const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id)

  const higherRatedUsers = await User.countDocuments({
    rating: { $gt: user.rating }
  })

  res.json({
    user,
    rank: higherRatedUsers + 1
  })
}
