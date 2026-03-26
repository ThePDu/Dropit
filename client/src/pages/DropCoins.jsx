
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API from '../api.js'

export default function DropCoins() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [balance, setBalance] = useState(0)
  const [displayBalance, setDisplayBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCoins = async () => {
    try {
      const { data } = await API.get('/coins');
      setBalance(data.balance);
      setTransactions(data.transactions);
      
      // Counter animation logic
      let start = displayBalance
      const end = data.balance
      const duration = 1000
      const increment = (end - start) / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
          setDisplayBalance(end)
          clearInterval(timer)
        } else {
          setDisplayBalance(Math.floor(start))
        }
      }, 16)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return navigate('/login')
    fetchCoins()
  }, [user])

  const tiers = [
    { coins: 100, reward: '₹5 off', icon: '🎟️' },
    { coins: 250, reward: '₹15 off', icon: '🎫' },
    { coins: 500, reward: 'Free delivery', icon: '🚚' },
    { coins: 1000, reward: '₹75 off any order', icon: '💰' },
  ]

  const earnWays = [
    { title: 'Every order', coins: 10, progress: 80, icon: '📦' },
    { title: 'Write a review', coins: 25, progress: 40, icon: '⭐' },
    { title: 'Refer a friend', coins: 100, progress: 10, icon: '🤝' },
    { title: '1st order of day', coins: 5, progress: 100, icon: '☀️' },
  ]

  const handleRedeem = async (tier) => {
    if (balance >= tier.coins) {
      try {
        const { data } = await API.post('/coins/redeem', { amount: tier.coins, reward: tier.reward });
        alert(`Redeemed ${tier.reward}!`);
        setBalance(data.balance);
        setTransactions(data.transactions);
        
        // Update display counter
        let start = displayBalance
        const end = data.balance
        const decrement = (start - end) / (500 / 16)
        const timer = setInterval(() => {
          start -= decrement
          if (start <= end) {
            setDisplayBalance(end)
            clearInterval(timer)
          } else {
            setDisplayBalance(Math.floor(start))
          }
        }, 16)
      } catch (err) {
        alert(err.response?.data?.error || 'Redemption failed');
      }
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#F5A623' }}>Loading Your Drop Coins...</div>
    </div>
  )

  const styles = {
    container: { maxWidth: 500, margin: '0 auto', padding: '20px', minHeight: 'calc(100vh - 72px)', background: '#f8f8f8', fontFamily: "'Inter', sans-serif" },
    hero: { background: 'linear-gradient(135deg, #F5A623 0%, #FF8C00 100%)', borderRadius: '24px', padding: '30px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(245, 166, 35, 0.3)', marginBottom: '24px', animation: 'fadeIn 0.5s ease' },
    coinIcon: { position: 'absolute', right: '-20px', top: '-20px', fontSize: '120px', opacity: 0.15, transform: 'rotate(-15deg)' },
    balanceLabel: { fontSize: '14px', fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px' },
    balanceVal: { fontSize: '48px', fontWeight: 900, margin: '5px 0', display: 'flex', alignItems: 'center', gap: '10px' },
    statsRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px', marginTop: '10px', fontSize: '12px' },
    sectionTitle: { fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    card: { background: 'white', borderRadius: '18px', padding: '16px', marginBottom: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #eee' },
    iconBox: { width: '40px', height: '40px', borderRadius: '12px', background: '#fff9f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
    progressBar: { height: '6px', background: '#f0f0f0', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#F5A623', transition: 'width 0.8s ease-in-out' },
    redeemBtn: (active) => ({ background: active ? '#F5A623' : '#f0f0f0', color: active ? 'white' : '#aaa', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: active ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }),
    historyRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
    expiryBanner: { background: '#FFF7E6', border: '1px solid #FFE58F', color: '#D48806', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }
  }

  return (
    <div style={styles.container}>
      {/* Expiry Warning */}
      <div style={styles.expiryBanner}>
        <span>⚠️</span>
        <span>Your <strong>125 Drop Coins</strong> are expiring in <strong>30 days</strong>. Use them soon!</span>
      </div>

      {/* Hero Dashboard */}
      <div style={styles.hero}>
        <div style={styles.coinIcon}>💰</div>
        <div style={styles.balanceLabel}>CURRENT BALANCE</div>
        <div style={styles.balanceVal}>
          <div style={{ background: '#fff', color: '#F5A623', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900 }}>₹</div>
          {displayBalance}
        </div>
        <div style={styles.statsRow}>
          <div>Earned this week: <strong>140</strong></div>
          <div>Redeemed total: <strong>1.2k</strong></div>
        </div>
      </div>

      {/* Earn Section */}
      <div style={styles.sectionTitle}>
        How to Earn
        <span style={{ fontSize: '13px', color: '#F5A623', fontWeight: 600 }}>Rules &rsaquo;</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {earnWays.map(way => (
          <div key={way.title} style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={styles.iconBox}>{way.icon}</div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>+{way.coins} Coins</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>{way.title}</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${way.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Redeem Section */}
      <div style={styles.sectionTitle}>Redeem Rewards</div>
      <div style={{ marginBottom: '24px' }}>
        {tiers.map(tier => {
          const canRedeem = balance >= tier.coins
          return (
            <div key={tier.coins} style={{ ...styles.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ ...styles.iconBox, borderRadius: '50%', background: '#f5f5f5' }}>{tier.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{tier.reward}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{tier.coins} Coins</div>
                </div>
              </div>
              <button 
                onClick={() => handleRedeem(tier)}
                style={styles.redeemBtn(canRedeem)}
              >
                {canRedeem ? 'Redeem' : `${tier.coins - balance} more`}
              </button>
            </div>
          )
        })}
      </div>

      {/* History */}
      <div style={styles.sectionTitle}>Recent Activity</div>
      <div style={{ ...styles.card, padding: '5px 16px' }}>
        {transactions.map((tx, i) => (
          <div key={tx._id || i} style={{ ...styles.historyRow, borderBottom: i === transactions.length - 1 ? 'none' : '1px solid #f5f5f5' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: tx.type === 'earned' ? '#f0fff4' : '#fff1f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              {tx.type === 'earned' ? '📥' : '📤'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{tx.description}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: tx.type === 'earned' ? '#0c831f' : '#e23744' }}>
              {tx.type === 'earned' ? '+' : '-'}{tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
