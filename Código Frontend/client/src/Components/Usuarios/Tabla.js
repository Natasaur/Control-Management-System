import React from 'react';
import { Table, Button, Card, Container, Alert, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useCsvTabla } from '../Tablas/CsvTablaFunctions';
import { BsTrashFill, BsPlus, BsCloudUploadFill, BsSave2 } from 'react-icons/bs';

export default function CsvTabla() {
    const {
        isFileSelected,
        csvData,
        seleccionarFila,
        mostrarModal,
        alerta,
        mensaje,
        manejarCargaCsv,
        manejarClickFila,
        agregarFila,
        eliminarFila,
        editarCelda,
        guardarCambios,
        alternarModal
    } = useCsvTabla();

    const renderTooltip = (text) => (
        <Tooltip id="tooltip">{text}</Tooltip>
    );

    return (
        <Card>
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Cargar usuarios por un CSV</h3>
            </div>
            <Card.Body>
                <Card.Title>En esta sección, podrás cargar un archivo CSV para registrar varios usuarios a la vez.</Card.Title>
                <Container className="d-flex flex-column justify-content-start h-100">
                    <div className="add-inicio mb-3">
                        <div className="label-container">
                            <label htmlFor="myFile" className="file-upload-label">
                                <input
                                    className="file-upload-input visually-hidden"
                                    type="file"
                                    id="myFile"
                                    accept=".csv"
                                    onChange={manejarCargaCsv}
                                />
                                <span className="file-upload-icon">
                                    <BsCloudUploadFill style={{ marginRight: 8 }} />
                                </span>
                                Subir archivo
                            </label>

                        </div>
                    </div>
                    <div className="table-container mb-3">
                        {csvData.length > 0 && (
                            <Table striped style={{ tableLayout: 'fixed', overflow: 'auto' }}>
                                <thead>
                                    <tr>
                                        {Object.keys(csvData[0]).map((columna, indice) => (
                                            <th
                                                key={indice}
                                                style={{
                                                    padding: '10px',
                                                    backgroundColor: '#5656B1',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    width: '100%',
                                                }}
                                            >
                                                {columna}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.map((fila, indiceFila) => (
                                        Object.values(fila).filter((celda) => celda !== '').length > 0 && (
                                            <tr
                                                key={indiceFila}

                                                onClick={() => manejarClickFila(indiceFila)}
                                            >
                                                {Object.keys(fila).map((columna, indiceColumna) => (
                                                    <td
                                                        key={indiceColumna}
                                                        style={{
                                                            padding: '5px',
                                                            textAlign: 'center',
                                                            width: `${100 / Object.keys(fila).length}%`,
                                                            background: seleccionarFila === indiceFila ? 'lightblue' : 'white',
                                                        }}
                                                    >
                                                        {isFileSelected ? (
                                                            <input
                                                                type="text"
                                                                value={fila[columna]}
                                                                onChange={(e) => editarCelda(indiceFila, columna, e.target.value)}
                                                                style={{
                                                                    border: 'none',
                                                                    outline: 'none',
                                                                    maxWidth: '100%', 
                                                                }}
                                                            />

                                                        ) : (
                                                            fila[columna]
                                                        )}
                                                    </td>
                                                ))}
                                                <td></td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Eliminar")}
                        >
                            <Button variant="danger" className="delete" onClick={eliminarFila}>
                                <BsTrashFill />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Agregar")}
                        >
                            <Button variant="primary" onClick={agregarFila}>
                                <BsPlus />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Guardar")}
                        >
                            <Button variant="success" onClick={guardarCambios}>
                                <BsSave2 />
                            </Button>
                        </OverlayTrigger>
                    </div>
                    {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
                </Container>
                <Modal show={mostrarModal} onHide={alternarModal}>
                    <Modal.Header>
                        <Modal.Title>Usuarios cargados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{mensaje}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { alternarModal(); window.location.reload(); }}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Card.Body>
        </Card>
    );
}
