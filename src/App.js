import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "./Table.css";
export default function MyDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      parseFile(acceptedFiles[0]);
    }
  }, []);

  const [files] = useState([]);
  var {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    inputRef,
  } = useDropzone(
    {
      onDrop,
      accept: ".csv",
    },
    {}
  );

  const [myFiles, setMyFiles] = useState([]);

  const [parsedCsvData, setParsedCsvData] = useState([]);

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setParsedCsvData(results.data);
        var eoddate = results.data[0]["Date"];
        var jsondata = JSON.stringify(results);
        var kil = jsondata["Company"];
        console.log(kil);
        console.log("done");
      },
    });
  };

  /************************************************ */
  const removeFile = (file) => () => {
    const acceptedFiles = [...myFiles];
    acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
    setMyFiles(acceptedFiles);
  };

  var removeAll = () => {
    setMyFiles([]);
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    inputRef.current.value = "";
  };
  /******************************************* */
  var importEod = () => {
    console.log("importing data to database here");
  };

  /*var test = parsedCsvData.map((parsedData, index);
  /************************************************* */
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const filepath = acceptedFiles.map((file) => (
    <span key={file.path}>
      {file.path} <br></br> <p>{file.size} bytes</p>
    </span>
  )); /*/** */
  /*************************Remove file button***************************** */
  const fil = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <button onClick={removeFile(file)}>Remove File</button>
    </li>
  ));
  /**************************Import to Database button***************************** */
  const fill = acceptedFiles.map(() => (
    <button onClick={importEod}>Import to Database</button>
  ));
  /*****************************YOU NEED TO WORK ON THE FILTER*************************/
  var startDate = new Date("2022-09-23");
  var endDate = new Date("2022-09-12");

  var resultProductData = acceptedFiles.map(function (a) {
    var date = new Date(a.Date);
    return date > startDate && date < endDate;
  });
  // console.log(resultProductData);

  /************************************************ */
  return (
    <div>
      <div className="inputArea">
        <div
          {...getRootProps({
            className: `dropZone
        ${isDragAccept && "dropzoneAccept"}
        ${isDragReject && "dropzoneReject"}`,
          })}
        >
          <input {...getInputProps()} accept={".csv"} type="file" />
          {
            isDragActive /*can put code for the file to show here*/ ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>"Drop CSV file here or click to upload"</p>
            ) /**/
          }
        </div>
        <div className="file">
          <div className="info">
            <aside> {filepath}</aside>
            <aside>{resultProductData}</aside>
          </div>
        </div>
      </div>

      <div className="but">
        <span>
          {fil.length > 0 && (
            <button className="button" onClick={removeAll}>
              Remove
            </button>
          )}
        </span>
        <span>
          {fill.length > 0 && (
            <button className="button" onClick={importEod}>
              Import to Database
            </button>
          )}
        </span>
      </div>

      <table className="all">
        <thead>
          <tr>
            <th>Companies</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {parsedCsvData &&
            parsedCsvData.map((parsedData, index) => (
              <tr key={index}>
                <td>{parsedData.Company}</td>
                <td>{parsedData.Date}</td>
                <td>{parsedData.Open}</td>
                <td>{parsedData.High}</td>
                <td>{parsedData.Low}</td>
                <td>{parsedData.Close}</td>
                <td>{parsedData.Volume}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
