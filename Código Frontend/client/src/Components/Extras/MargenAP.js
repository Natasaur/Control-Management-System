import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/utc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import Cookie from 'js-cookie';

const Margen = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);

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

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-1 d-none d-lg-block position-fixed vh-100 p-0" style={{ backgroundColor: '#011F5D' }}>
                        <div className="container-fluid d-flex align-items-center justify-content-center flex-column">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px', marginTop: '20px' }}>
                                <span className="h2">
                                    <FontAwesomeIcon icon={faUser} size="sm" />
                                </span>
                            </div>
                            <div>
                                <Link to="/cambioB" className="nav-link text-white mb-4">Editar perfil</Link>
                            </div>
                            <div>
                                <button className="nav-link text-white" onClick={handleLogout}>Salir</button>
                            </div>
                        </div>
                        <div className="container-fluid">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <ul className="navbar-nav mt-lg-5">
                                    <li className="nav-item">
                                        <Link to="/Inicio-usuario" className="nav-link text-white">Administración de usuarios</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/Parametro" className="nav-link text-white">Administración de parámetros</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-11 offset-lg-1 p-0">
                        <nav className="navbar navbar-expand-lg bg-white border-bottom" style={{ borderTop: '1px solid #ccc' }}>
                            <div className="container-fluid">
                                <div className="d-flex align-items-center">
                                    <div className="navbar-brand">
                                        <img className="logo-utc" src={logo} alt="Logo UTC" style={{ width: '60px', height: 'auto' }} />
                                    </div>
                                    <h2 className="titulo-1 mb-0" style={{ marginTop: '10px', fontSize: '1.8rem' }}>UNIVERSIDAD TRES CULTURAS</h2>
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
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px', marginTop: '20px' }}>
                                    <span className="h2">
                                        <FontAwesomeIcon icon={faUser} size="sm" />
                                    </span>
                                </div>
                                <div>
                                    <Link to="/cambio" className="nav-link text-white mb-4">Editar perfil</Link>
                                </div>
                                <div>
                                    <button className="nav-link text-white" onClick={handleLogout}>Salir</button>
                                </div>
                                <div className="d-flex flex-column justify-content-center align-items-center mt-lg-5">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <Link to="/Inicio-usuario" className="nav-link text-white">Administración de usuarios</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/Parametro" className="nav-link text-white">Administración de parámetros</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Margen;
