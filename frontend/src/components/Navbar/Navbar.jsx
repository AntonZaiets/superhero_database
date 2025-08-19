import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import '../shared-styles.css';
import './styles.css';

export const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-content">
      <Link to="/" className="navbar-title">
        🦸‍♂️ Superhero Database
      </Link>
      <div className="navbar-actions">
        <Link to="/create" className="btn btn-primary">
          <Plus size={20} />
          Add Superhero
        </Link>
      </div>
    </div>
  </nav>
);
