import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiMoreVertical } from 'react-icons/fi';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <FiMoreVertical
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        size={24}
        style={{ cursor: 'pointer' }}
    />
));

const MoreOption = () => {
    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />

            <Dropdown.Menu align="end" style={{ left: 'auto', right: 0, backgroundColor: "#D5DAF1" }} className=''>
                <Dropdown.Item className=''>Add User</Dropdown.Item>
                <Dropdown.Item>Group Info</Dropdown.Item>
                <Dropdown.Item>Leave Group</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default MoreOption;
