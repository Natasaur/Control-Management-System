import React from 'react';
import { Table, Button, Card, Container, Modal, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCsvTabla } from './TablaFunctios';
import { BsTrashFill, BsPlus, BsCloudUploadFill, BsSave2 } from 'react-icons/bs';

export default function CsvTabla() {
    const {
        seleccionadoArchivo,
        csvData,
        seleccionarFila,
        mostrarModal,
        mensaje,
        alerta,
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
            <Card.Body>
                <Card.Title>Cargar lista de asistencia por un CSV</Card.Title>
                <Card.Text>
                    En esta sección, podrás cargar el archivo CSV de asistencias generado por la aplicación móvil.
                </Card.Text>
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
                                                        {seleccionadoArchivo ? (
                                                            <input
                                                                type="text"
                                                                value={fila[columna]}
                                                                onChange={(e) =>
                                                                    editarCelda(indiceFila, columna, e.target.value)
                                                                }
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
                    <Modal.Header closeButton>
                        <Modal.Title>Asistencias guardadas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{mensaje}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={alternarModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}