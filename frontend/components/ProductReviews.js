import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => !readOnly && onChange && onChange(star)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myReview, setMyReview] = useState(null);
  const [form, setForm] = useState({ rating: 0, comment: '' });
  const [formMsg, setFormMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsAPI.getReviews(productId);
      setReviews(data);
      if (user) {
        const mine = data.find(r => r.userId === user.id);
        setMyReview(mine || null);
      }
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg('');
    try {
      await productsAPI.addReview(productId, form);
      setFormMsg('Review submitted!');
      setForm({ rating: 0, comment: '' });
      fetchReviews();
    } catch (err) {
      setFormMsg(err.message || 'Failed to submit review');
    } finally {
      setFormLoading(false);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-8 px-2 sm:px-0">
      <h2 className="text-xl font-bold mb-2 text-[#2E251D]">Customer Reviews</h2>
      {loading ? (
        <div>Loading reviews...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center mb-2 gap-2">
            <span className="text-lg font-semibold mr-2">{avgRating || 'No ratings yet'}</span>
            <StarRating value={avgRating ? Math.round(avgRating) : 0} readOnly />
            <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>
          {user && !myReview && (
            <form onSubmit={handleSubmit} className="mb-4 bg-gray-50 p-4 rounded flex flex-col gap-2">
              <div className="mb-1 text-base text-[#2E251D]">Your Rating:</div>
              <StarRating value={form.rating} onChange={handleRatingChange} />
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleFormChange}
                placeholder="Write a review (optional)"
                className="border rounded px-3 py-2 w-full mt-2 text-base"
              />
              <button
                type="submit"
                className="w-full bg-[#b48a4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition mt-2 shadow text-base"
                disabled={formLoading || !form.rating}>
                {formLoading ? 'Submitting...' : 'Submit Review'}
              </button>
              {formMsg && <div className="mt-2 text-green-600 text-center">{formMsg}</div>}
            </form>
          )}
          {user && myReview && (
            <div className="mb-4 text-green-700 text-center">You have already reviewed this product.</div>
          )}
          <div>
            {reviews.length === 0 ? (
              <div>No reviews yet.</div>
            ) : (
              <ul>
                {reviews.map(r => (
                  <li key={r.id} className="mb-4 border-b pb-2 px-1 sm:px-0">
                    <div className="flex flex-col sm:flex-row items-center mb-1 gap-2">
                      <StarRating value={r.rating} readOnly />
                      <span className="font-semibold text-[#2E251D]">{r.User ? r.User.name : 'User'}</span>
                      <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <div className="text-gray-700 text-base break-words">{r.comment}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 