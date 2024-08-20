
import { AppBar, Toolbar, styled, Button } from '@mui/material'; 
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';


const Component = styled(AppBar)`
    background: teal;
    color: black;
`;

const Container = styled(Toolbar)`
    justify-content: right;
    & > a {
        padding: 20px;
        color: black;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        text-decoration: none;
    }
`

const Header = ({username}) => {

    const navigate = useNavigate();

    const logout = async () => navigate('/account');
        
    return (
        <Component>
            <Container>
                <Link to='/'>{username}</Link>
                
                
                <Link to='/account' >LOGOUT</Link>
            </Container>
        </Component>
    )
}

export default Header;