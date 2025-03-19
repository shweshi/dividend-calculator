const Footer = () => {
    return (
      <footer className="text-white p-4 text-center mt-8">
        <div className="mt-4 text-sm text-gray-300 text-center">
          <div className="inline-block text-left">
            <p>
              1. Login to your <strong>Zerodha Console</strong>.
            </p>
            <p>
              2. Navigate to{' '}
              <strong>
                Reports &gt; Downloads &gt; Select Statement &gt; Dividend
                statement
              </strong>
              .
            </p>
            <p>3. Select the desired time range.</p>
            <p>
              4. Click on <strong>Download</strong> and choose the{' '}
              <strong>XLSX</strong> format.
            </p>
            <p>5. Upload the downloaded file here.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;