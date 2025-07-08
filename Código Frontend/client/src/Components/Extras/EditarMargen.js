import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/utc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars } from '@fortawesome/free-solid-svg-icons';
import Cookie from 'js-cookie';

const EditarMargen = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const rol = Cookie.get('rol');

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const handleLogout = () => {
        Cookie.remove('token');
        Cookie.remove('matricula');
        Cookie.remove('plantel');
        Cookie.remove('rol');
        window.location.href = '/';
    };

    const getInicioRoute = () => {
        if (rol === 'AP') {
            return '/Inicio-usuario';
        } else if (rol === 'C') {
            return '/Consultor';
        } else {
            return '/rector';
        }
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-12 p-0">
                        <nav className="navbar navbar-expand-lg bg-white border-bottom" style={{ borderTop: '1px solid #ccc' }}>
                            <div className="container-fluid d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="navbar-brand">
                                        <img className="logo-utc" src={logo} alt="Logo UTC" style={{ width: '60px', height: 'auto' }} />
                                    </div>
                                    <h2 className="titulo-1 mb-0" style={{ marginTop: '10px', fontSize: '1.8rem' }}>UNIVERSIDAD TRES CULTURAS</h2>
                                </div>
                                <div className="d-flex">
                                    <div className="text-center" style={{ marginRight: '25px', fontSize: '20px' }}>
                                        <Link to={getInicioRoute()} className="nav-link text-blue d-none d-lg-block">Inicio</Link>
                                    </div>
                                    <div className="text-center" style={{ marginRight: '100px', fontSize: '20px' }}>
                                        <button className="nav-link text-blue d-none d-lg-block" onClick={handleLogout}>Salir</button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="col-12 d-lg-none">
                        <div className="menu-icon" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} size="lg" />
                        </div>
                        <div className={`container-fluid mt-2 ${menuAbierto ? '' : 'd-none'}`} style={{ backgroundColor: '#011F5D' }}>
                            <div className="container-fluid d-flex align-items-center justify-content-center flex-column">
                                <div className="text-center mb-4">
                                    <Link to={getInicioRoute()} className="nav-link text-white">Inicio</Link>
                                </div>
                                <div className="text-center">
                                    <button className="nav-link text-white" onClick={handleLogout}>Salir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarMargen;
