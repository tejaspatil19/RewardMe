
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TableContainer from './components/TableContainer/TableContainer';


const App = () => (
  <>
    <CssBaseline />
    <Box className="App" minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Box component="main" flex={1} py={2}>
  <TableContainer />
      </Box>
      <Footer />
    </Box>
  </>
);

export default App;
