export default function SignupPage() {
  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <button style={styles.backButton}>&lt; BACK TO MAP</button>
        <h1 style={styles.title}>SIGN UP</h1>
      </header>

      {/* Main Sign Up Page */}
      <main style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tab, ...styles.activeTab }}>SIGN UP</button>
        </div>

        {/* Top Button */}
        <button style={styles.secondaryBtn}>SIGN UP VIA UP MAIL</button>

        <div style={styles.divider}>OR SIGN UP MANUALLY</div>

        {/* Form Fields */}
        <form style={styles.form}>
          
          {/* 2-Column Row: First & Last Name */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>First Name</label>
              <input type="text" placeholder="e.g Juan" style={styles.input} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Last Name</label>
              <input type="text" placeholder="e.g Dela Cruz" style={styles.input} />
            </div>
          </div>

          <label style={styles.label}>Email Address</label>
          <input type="email" placeholder="e.g jdelacruz@up.edu.ph" style={styles.input} />

          <label style={styles.label}>College</label>
          <input type="text" placeholder="e.g College of Arts and Science" style={styles.input} />

          {/* 2-Column Row: Degree & Year */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Degree Program</label>
              <input type="text" placeholder="e.g BS Computer Science" style={styles.input} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Year Level</label>
              <input type="text" placeholder="e.g 2nd Year" style={styles.input} />
            </div>
          </div>

          <label style={styles.label}>Password</label>
          <input type="password" placeholder="Min. 8 characters" style={styles.input} />

          <label style={styles.label}>Confirm Password</label>
          <input type="password" placeholder="Repeat Password" style={styles.input} />

          {/* Checkbox Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', marginBottom: '20px', fontSize: '0.9rem', color: '#004d40' }}>
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to the terms of service and community guidelines.</label>
          </div>

          <button type="submit" style={styles.loginBtn}>CREATE ACCOUNT</button>
        </form>

        <p style={{ ...styles.footerText, marginTop: '20px', marginBottom: '10px' }}>
          You'll receive a verification email before you can log in.
        </p>
        <a href="#" style={styles.link}>Already have an account? Log in →</a>
      </main>
    </div>
  );
}

{/* CSS Part */}
const styles = {
  container: { 
    backgroundImage: `url('/map-background.png')`, //add the bg for the main page
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh', 
    width: '100vw',
    fontFamily: 'sans-serif' 
  },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '1rem', 
    backgroundColor: '#b8e0a4', 
    borderBottom: '1px solid #7cb342'
  },
  backButton: { 
    border: '1px solid #7cb342', 
    color: '#7cb342', 
    background: 'none', 
    padding: '5px 10px', 
    cursor: 'pointer', 
    borderRadius: '4px' 
  },
  title: { 
    flex: 1, 
    textAlign: 'center', 
    margin: 0, 
    fontSize: '1.5rem', 
    color: '#004d40', 
    fontWeight: 'bold' 
  },
  card: { 
    maxWidth: '500px', 
    margin: '100px auto', 
    padding: '2rem', 
    backgroundColor: '#e8f5e9',
    border: '1px solid #7cb342',
    borderRadius: '8px', 
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
  },
  tabContainer: { 
    display: 'flex', 
    marginBottom: '1.5rem', 
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tab: { 
    flex: 1, 
    padding: '10px', 
    border: 'none', 
    background: '#ffffff', 
    color: '#004d40', 
    cursor: 'pointer' 
  },
  activeTab: { 
    background: '#004d40', 
    color: '#ffffff', 
    fontWeight: 'bold' 
  },
  form: { textAlign: 'left', display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '5px', marginTop: '10px', color: '#004d40' },
  input: { 
    padding: '10px', 
    border: '1px solid #7cb342', 
    color: '#004d40',
    borderRadius: '4px', 
    marginBottom: '10px',
    background: '#ffffff'
  },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1rem', color: '#004d40' },
  loginBtn: { 
    padding: '12px', 
    border: '1px solid #7cb342', 
    color: '#004d40', 
    background: 'none', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  divider: { margin: '20px 0', color: '#004d40', fontWeight: 'bold' },
  secondaryBtn: { 
    width: '100%', 
    padding: '10px', 
    marginBottom: '10px', 
    border: '1px solid #7cb342', 
    color: '#004d40',
    background: '#eee', 
    cursor: 'pointer' 
  },
  footerText: { fontSize: '0.8rem', color: '#004d40', fontStyle: 'italic' },
  link: { fontSize: '0.9rem', color: '#004d40', textDecoration: 'underline' }
};