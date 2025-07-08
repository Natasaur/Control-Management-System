import React from 'react';
import { Table, Button, Card, Container, Form, Alert, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useCsvTablaFunctionsA } from './CsvTablaFunctionA';
import { BsTrashFill, BsPlus, BsCloudUploadFill, BsSave2 } from 'react-icons/bs';

export function TablaAlumnos() {
    const {
        seleccionadoArchivo,
        csvData,
        seleccionarFila,
        alerta,
        mensaje,
        mostrarModal,
        manejarCargaCsv,
        manejarClickFila,
        agregarFila,
        eliminarFila,
        editarCelda,
        guardarCambios,
        alternarModal,
    } = useCsvTablaFunctionsA();
    const renderTooltip = (text) => (
        <Tooltip id="tooltip">{text}</Tooltip>
    );
    return (
        <Card>
            <Card.Body>
                <Card.Title>Cargar alumnos por un CSV</Card.Title>
                <Card.Text>
                    En esta sección, podrás cargar un archivo CSV para registrar varios alumnos a la vez.
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
                            <Table bordered striped hover responsive>
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
                                                }}
                                            >
                                                {columna}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.map((fila, indiceFila) => {
                                        const tieneContenido = Object.values(fila).some((celda) => celda !== '');
                                        return tieneContenido ? (
                                            <tr
                                                key={indiceFila}
                                                onClick={() => manejarClickFila(indiceFila)}
                                            >
                                                {Object.keys(fila).map((columna, indiceColumna) => (
                                                    <td
                                                        key={indiceColumna}
                                                        style={{
                                                            padding: '10px',
                                                            textAlign: 'center',
                                                            width: `${100 / Object.keys(fila).length}%`,
                                                            background: seleccionarFila === indiceFila ? 'lightblue' : 'white',
                                                        }}
                                                    >
                                                        {seleccionadoArchivo ? (
                                                            <Form.Control
                                                                type="text"
                                                                value={fila[columna]}
                                                                onChange={(e) =>
                                                                    editarCelda(indiceFila, columna, e.target.value)
                                                                }
                                                                style={{
                                                                    border: 'none',
                                                                    outline: 'none',
                                                                    Maxwidth: '100%',
                                                                }}
                                                            />
                                                        ) : (
                                                            fila[columna]
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ) : null;
                                    })}
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
                        <Modal.Title>Alumnos guardados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{mensaje}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"  onClick={() => { alternarModal(); window.location.reload(); }}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}

