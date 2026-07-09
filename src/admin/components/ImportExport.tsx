import { useState } from "react";
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Button,
  Typography,
  Alert,
  Loader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@strapi/design-system";
import { useRef } from "react";
import { Upload, Download, Database, Information, Cross } from "@strapi/icons";

interface ImportStats {
  total: number;
  success: number;
  failed: number;
}

interface ImportError {
  row: string;
  error: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  stats?: ImportStats;
  errors?: ImportError[];
}

interface ExportResult {
  success: boolean;
  message: string;
}

interface Collection {
  id: string;
  label: string;
  description?: string;
}

const SAMPLE_CSV_MAP: Record<string, string> = {
  supplements: `Supplement Name,Dosage Cortisol,Dosage Inflammation,Dosage Muscle Damage,Dosage Muscle Soreness,Dosage Oxidative Stress,Dosage Pain,Dosage Sleep Quality,Grade Score Cortisol,Grade Score Inflammation,Grade Score Muscle Damage,Grade Score Muscle Soreness,Grade Score Oxidative Stress,Grade Score Pain,Grade Score Sleep Quality,Inflammation Sum,Label,Linear Score Cortisol,Linear Score Inflammation,Linear Score Muscle Damage,Linear Score Muscle Soreness,Linear Score Oxidative Stress,Linear Score Pain,Linear Score Sleep Quality,Max Cortisol,Max Inflammation,Max Muscle Soreness,Max Oxidative Stress,Max Pain,Max Sleep Quality,Muscle Damage Max,Muscle Damage Sum,Muscle Damage Sum (non rollup),Muscle Soreness Sum (non rollup),Papers,Results,Sum Cortisol,Sum Cortisol (non rollup),Sum Inflammation,Sum Inflammation (non rollup),Sum Muscle Damage Participants,Sum Muscle Soreness,Sum Muscle Soreness Participants,Sum Oxidative Stress,Sum Oxidative Stress (non rollup),Sum Pain,Sum Pain (non rollup),Sum Participants Cortisol,Sum Participants Inflammation,Sum Participants Oxidative Stress,Sum Participants Pain,Sum Participants Sleep Quality,Sum Sleep Quality,Sum Sleep Quality (non rollup),Sum Studies Cortisol,Sum Studies Inflammation,Sum Studies Muscle Damage,Sum Studies Muscle Soreness,Sum Studies Oxidative Stress,Sum Studies Pain,Sum Studies Sleep Quality,TLDR: Cortisol,TLDR: Inflammation,TLDR: Muscle Damage,TLDR: Muscle Soreness,TLDR: Oxidative Stress,TLDR: Pain,TLDR: Sleep Quality,📊 Stats
Agmatine1,1,1,1,1,1,1,1,D,D,D,D,D,C-,D,0,"Dietary agmatine sulfate, a substance derived from a type of amino acid, can help reduce pain and improve the quality of life for people suffering from radiculopathy due to a herniated lumbar disc.,Agmatine, an amino acid, was found to help depressed people feel better in this study. It relieved symptoms of depression without serious side effects.",0,0,0,0,0,7.142857143,0,4,19,4,14,14,9,8,0,0,0,2,2,0,0,0,0,0,0,0,0,0,1,1,0,0,0,61,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,All Supplements (https://www.notion.so/All-Supplements-1d959c2aeec58031a21aec83944810a1?pvs=21)
`,

  "research-papers": `Paper,AMEND,Age,Area,Body Type,Cortisol Exercise Cleaning,Created time,Effect,Files & media,Fitness Cleaning,Funding Notes,Label,Last edited time,Meta Checked,NULL,Number of Participants,Participants Cortisol,Participants Inflammation,Participants Muscle Damage,Participants Muscle Soreness,Participants Oxidative Stress,Participants Pain,Participants Sleep Quality,Product,Related to Results (1) (Research Papers ),Related to Results (1) (Research Papers ) 1,Results,Sex,Source,Studies Cortisol,Studies Inflammation,Studies Muscle Damage,Studies Muscle Soreness,Studies Oxidative Stress,Studies Pain,Studies Sleep Quality,Supplement,TLDR,Trial Design,Trial Length,URL,Year,Title
https://pubmed.ncbi.nlm.nih.gov/26502953,No,,"Anxiety,Cognition,Mood,Stress",,No,"June 6, 2023 13:49",Decrease,,No,"""This research was supported by a grant funded by Dr Willmar Schwabe Gmbh & Co. KG.”","Anxiety,Cognition,Mood,Stress","April 18, 2025 16:17",No,No,80,0,0,0,0,0,0,0,,"Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-f35c0f75c423415abd82e9bd7d840a86?pvs=21), Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-e331af457e7043c3aacf680b9a0c5836?pvs=21), Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-19ba3f75e4c94a72bd20065bb6a441b3?pvs=21), There were no observed benefits in terms of cognitive performance improvement among participants who took Rhodiola rosea L. extract compared to those who did not. (https://www.notion.so/There-were-no-observed-benefits-in-terms-of-cognitive-performance-improvement-among-participants-who-209fca31240d4bf9a7ae83983dc8641c?pvs=21)","Untitled (https://www.notion.so/0c45924eb27341659a0796f368b07bc7?pvs=21), Untitled (https://www.notion.so/0ebfe6ab718343d59d9a0bd6b92a3f47?pvs=21), Untitled (https://www.notion.so/c996a30936904cd5a490d67b3b5929d3?pvs=21)","Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-9213a1e9a4ca4121b6006c1f95ff0abc?pvs=21), There were no observed benefits in terms of cognitive performance improvement among participants who took Rhodiola rosea L. extract compared to those who did not. (https://www.notion.so/There-were-no-observed-benefits-in-terms-of-cognitive-performance-improvement-among-participants-who-d56afd40c7454b62a2715ce3adc534dc?pvs=21), Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-8fd9402b753648e79a43f53c985d0ea6?pvs=21), Participants who took the Rhodiola rosea L. extract reported a significant decrease in anxiety, stress, anger, confusion, depression and overall mood improvement after 14 days. (https://www.notion.so/Participants-who-took-the-Rhodiola-rosea-L-extract-reported-a-significant-decrease-in-anxiety-stre-249bbbdc8a2e4f5485703ac4412c2335?pvs=21)",Both sexes,"Anxiety Symptoms, Depression Symptoms, Fatigue Symptoms, Sleep Quality, Stress Signs And Symptoms, Vigor/Activity",0,0,0,0,0,0,0,Rhodiola Rosea,,Randomized controlled trial,1-2 Weeks,https://pubmed.ncbi.nlm.nih.gov/26502953/,,"The Effects of Rhodiola rosea L. Extract on Anxiety, Stress, Cognition and Other Mood Symptoms"`,

  results: `Results,Age,Benefit,Benefit Value,Body Type,Confidence,Cortisol Cleaning,Cortisol Filter,Created time,Inflammation Filter,Last edited time,Main Tag,Max Pain,Muscle Damage Filter,Muscle Soreness Filter,Oxidative Stress Filter,Pain Filter,Participants,Product,Score,Sex,Sleep Quality Filter,Sub Tag,Trial Design,Trial Length,Year,Supplements,Research Papers
Participants who,18,Positive,1,,✅,No,0,"June 6, 2023 14:08",0,"April 18, 2025 16:16",Anxiety,Rhodiola Rosea,0,0,0,0,80,,1,Both sexes,0,,Randomized controlled trial,1-2 Weeks,2024,"3520,3522","36208,36233"
`,
};

type ApiResult = ImportResult | ExportResult | null;

export default function SupplementImportExport() {
  const [importing, setImporting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [result, setResult] = useState<ApiResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<string>("supplements");
  const [collections] = useState<Collection[]>([
    {
      id: "supplements",
      label: "Supplements",
      description: "Nutritional supplement entries",
    },
    {
      id: "research-papers",
      label: "Research Papers",
      description: "Scientific research documents",
    },
    {
      id: "results",
      label: "Results",
      description: "Research findings and outcomes",
    },
  ]);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE = "/api/import-export";

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", selectedCollection);

      const response = await fetch(`${API_BASE}/import`, {
        method: "POST",
        body: formData,
      });

      const data: ImportResult = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Import failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error occurred");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/export?collection=${selectedCollection}`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedCollection}-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setResult({ success: true, message: "Export completed successfully" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSample = () => {
    const csv = SAMPLE_CSV_MAP[selectedCollection];
    if (!csv) return;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCollection}-sample.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isImportResult = (result: ApiResult): result is ImportResult => {
    return result !== null && "stats" in result;
  };

  const getSelectedCollectionLabel = () => {
    return (
      collections.find((c) => c.id === selectedCollection)?.label || "Unknown"
    );
  };

  const handleCollectionChange = (value: string | number) => {
    setSelectedCollection(String(value));
  };

  return (
    <Box background="neutral100" padding={8}>
      {/* Header */}
      <Box paddingBottom={6}>
        <Flex direction="column" gap={2}>
          <Typography variant="alpha">Data Import/Export</Typography>
          <Typography variant="epsilon" textColor="neutral600">
            Manage data across all collections with CSV files
          </Typography>
        </Flex>
      </Box>

      {/* Collection Selector */}
      <Box
        background="neutral0"
        padding={6}
        marginBottom={6}
        hasRadius
        shadow="filterShadow"
      >
        <Flex direction="column" gap={4}>
          <Flex alignItems="center" gap={3}>
            <Database width="24px" height="24px" />
            <Typography variant="delta" fontWeight="bold">
              Select Collection
            </Typography>
          </Flex>

          <SingleSelect
            label="Collection"
            placeholder="Select a collection"
            value={selectedCollection}
            onChange={handleCollectionChange}
          >
            {collections.map((col) => (
              <SingleSelectOption key={col.id} value={col.id}>
                {col.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>

          {selectedCollection && (
            <Flex gap={2}>
              <Typography variant="omega" fontWeight="bold">
                Currently selected:
              </Typography>
              <Typography variant="omega" textColor="primary600">
                {getSelectedCollectionLabel()}
              </Typography>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Action Cards */}
      <Flex gap={6} marginBottom={8}>
        <Box
          style={{ flex: 1 }}
          background="neutral0"
          padding={6}
          hasRadius
          shadow="filterShadow"
        >
          <Flex direction="column" gap={4}>
            <Flex alignItems="center" gap={3}>
              <Box background="primary100" padding={3} hasRadius>
                <Upload width="24px" height="24px" />
              </Box>
              <Typography variant="delta" fontWeight="bold">
                Import Data
              </Typography>
            </Flex>

            <Typography variant="epsilon" textColor="neutral600">
              Upload a CSV file to import or update records in the selected
              collection. Existing records will be updated based on their unique
              identifiers.
            </Typography>

            <input
              type="file"
              id="import-file"
              accept=".csv"
              onChange={handleImport}
              ref={fileInputRef}
              disabled={importing}
              style={{ display: "none" }}
            />

            <Button
              variant="default"
              startIcon={importing ? <Loader small /> : <Upload />}
              disabled={importing}
              fullWidth
              onClick={() => fileInputRef.current?.click()}
            >
              {importing ? "Importing..." : "Choose CSV File"}
            </Button>
          </Flex>
        </Box>

        <Box
          style={{ flex: 1 }}
          background="neutral0"
          padding={6}
          hasRadius
          shadow="filterShadow"
        >
          <Flex direction="column" gap={4}>
            <Flex alignItems="center" gap={3}>
              <Box background="success100" padding={3} hasRadius>
                <Download width="24px" height="24px" />
              </Box>
              <Typography variant="delta" fontWeight="bold">
                Export Data
              </Typography>
            </Flex>

            <Typography variant="epsilon" textColor="neutral600">
              Download all records from the selected collection as a CSV file.
              The export includes all fields and maintains data relationships.
            </Typography>

            <Button
              variant="default"
              startIcon={exporting ? <Loader small /> : <Download />}
              onClick={handleExport}
              disabled={exporting}
              fullWidth
            >
              {exporting ? "Exporting..." : "Export Collection"}
            </Button>
          </Flex>
        </Box>

        <Box
          style={{ flex: 1 }}
          background="neutral0"
          padding={6}
          hasRadius
          shadow="filterShadow"
        >
          <Flex direction="column" gap={4}>
            <Flex alignItems="center" gap={3}>
              <Box background="warning100" padding={3} hasRadius>
                <Download width="24px" height="24px" />
              </Box>
              <Typography variant="delta" fontWeight="bold">
                Download Sample CSV
              </Typography>
            </Flex>

            <Typography variant="epsilon" textColor="neutral600">
              Download a sample CSV template for{" "}
              <Typography fontWeight="bold">
                {getSelectedCollectionLabel()}
              </Typography>{" "}
              to ensure proper formatting before importing.
            </Typography>

            <Button
              variant="secondary"
              startIcon={<Download />}
              onClick={handleDownloadSample}
            >
              Download Sample CSV
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* Results & Errors */}
      {result && (
        <Box marginBottom={6}>
          <Alert
            variant={result.success ? "success" : "danger"}
            title={result.success ? "Operation Successful" : "Operation Failed"}
            onClose={() => setResult(null)}
            closeLabel="Close"
          >
            <Flex direction="column" gap={3}>
              <Typography>{result.message}</Typography>

              {isImportResult(result) && result.stats && (
                <Flex gap={6} marginTop={2}>
                  <Flex alignItems="center" gap={2}>
                    <Typography variant="epsilon" fontWeight="bold">
                      Total:
                    </Typography>
                    <Box
                      background="neutral150"
                      padding={2}
                      paddingLeft={3}
                      paddingRight={3}
                      hasRadius
                    >
                      <Typography variant="pi" fontWeight="bold">
                        {result.stats.total}
                      </Typography>
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Typography variant="epsilon" fontWeight="bold">
                      Success:
                    </Typography>
                    <Box
                      background={
                        result.stats.success > 0 ? "success100" : "neutral150"
                      }
                      padding={2}
                      paddingLeft={3}
                      paddingRight={3}
                      hasRadius
                    >
                      <Typography variant="pi" fontWeight="bold">
                        {result.stats.success}
                      </Typography>
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Typography variant="epsilon" fontWeight="bold">
                      Failed:
                    </Typography>
                    <Box
                      background={
                        result.stats.failed > 0 ? "danger100" : "neutral150"
                      }
                      padding={2}
                      paddingLeft={3}
                      paddingRight={3}
                      hasRadius
                    >
                      <Typography variant="pi" fontWeight="bold">
                        {result.stats.failed}
                      </Typography>
                    </Box>
                  </Flex>
                </Flex>
              )}

              {isImportResult(result) &&
                result.errors &&
                result.errors.length > 0 && (
                  <Box marginTop={4}>
                    <Button
                      variant="tertiary"
                      onClick={() => setShowErrors(true)}
                      startIcon={<Information />}
                    >
                      View {result.errors.length} error(s)
                    </Button>
                  </Box>
                )}
            </Flex>
          </Alert>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Box marginBottom={6}>
          <Alert
            variant="danger"
            title="Error"
            onClose={() => setError(null)}
            closeLabel="Close"
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Instructions */}
      <Box background="neutral0" padding={6} hasRadius shadow="filterShadow">
        <Flex direction="column" gap={4}>
          <Flex alignItems="center" gap={3}>
            <Information width="20px" height="20px" />
            <Typography variant="delta" fontWeight="bold">
              Instructions & Guidelines
            </Typography>
          </Flex>

          <Flex gap={4} direction="row" wrap="wrap">
            <Box style={{ flex: "1 1 45%", minWidth: "300px" }}>
              <Flex direction="column" gap={3}>
                <Typography variant="epsilon" fontWeight="bold">
                  Import Guidelines:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>
                    <Typography variant="epsilon">
                      CSV files must include headers
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      Use unique identifiers for updates
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      Relations are handled automatically
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      Maximum file size: 10MB
                    </Typography>
                  </li>
                </ul>
              </Flex>
            </Box>
            <Box style={{ flex: "1 1 45%", minWidth: "300px" }}>
              <Flex direction="column" gap={3}>
                <Typography variant="epsilon" fontWeight="bold">
                  Export Guidelines:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>
                    <Typography variant="epsilon">
                      Exports include all published entries
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      File downloads automatically
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      CSV format with UTF-8 encoding
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="epsilon">
                      Relations are exported as IDs
                    </Typography>
                  </li>
                </ul>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Errors Modal */}
      {isImportResult(result) && result.errors && showErrors && (
        <>
          {/* Backdrop */}
          <Box
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9998,
            }}
            onClick={() => setShowErrors(false)}
          />

          {/* Modal */}
          <Box
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
            background="neutral0"
            hasRadius
            shadow="tableShadow"
          >
            {/* Header */}
            <Flex
              padding={6}
              justifyContent="space-between"
              alignItems="center"
              borderColor="neutral200"
              style={{ borderBottom: "1px solid" }}
            >
              <Typography
                fontWeight="bold"
                textColor="neutral800"
                variant="beta"
              >
                Import Errors ({result.errors.length})
              </Typography>
              <Button
                variant="tertiary"
                onClick={() => setShowErrors(false)}
                startIcon={<Cross />}
              >
                Close
              </Button>
            </Flex>

            {/* Body */}
            <Box padding={6} style={{ maxHeight: "60vh", overflow: "auto" }}>
              <Table colCount={2} rowCount={result.errors.length}>
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma">Row</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Error Message</Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {result.errors.map((err, idx) => (
                    <Tr key={idx}>
                      <Td>
                        <Typography variant="omega">{err.row}</Typography>
                      </Td>
                      <Td>
                        <Typography variant="omega" textColor="danger600">
                          {err.error}
                        </Typography>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Footer */}
            <Flex
              padding={6}
              justifyContent="flex-end"
              borderColor="neutral200"
              style={{ borderTop: "1px solid" }}
            >
              <Button onClick={() => setShowErrors(false)} variant="secondary">
                Close
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  );
}
