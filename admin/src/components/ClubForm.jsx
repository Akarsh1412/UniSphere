const ClubForm = ({ club }) => {
  const [formData, setFormData] = useState({
    // ... existing fields
    membership_fee: club?.membership_fee || 0,
    stripe_price_id: club?.stripe_price_id || ''
  });

  return (
    <form>
      {/* ... existing fields */}
      
      <div className="form-group">
        <label>Membership Fee (₹)</label>
        <input 
          type="number" 
          value={formData.membership_fee}
          onChange={e => setFormData({...formData, membership_fee: e.target.value})}
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="form-group">
        <label>Stripe Price ID</label>
        <input 
          type="text" 
          value={formData.stripe_price_id}
          onChange={e => setFormData({...formData, stripe_price_id: e.target.value})}
          placeholder="price_xxxxxx"
        />
      </div>
    </form>
  );
};