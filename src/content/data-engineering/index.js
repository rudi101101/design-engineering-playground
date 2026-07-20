import { term as acid } from "./acid.js";
import { term as auditLogging } from "./audit-logging.js";
import { term as base } from "./base.js";
import { term as batchProcessing } from "./batch-processing.js";
import { term as bloomFilter } from "./bloom-filter.js";
import { term as caching } from "./caching.js";
import { term as capTheorem } from "./cap-theorem.js";
import { term as cardinality } from "./cardinality.js";
import { term as cdc } from "./cdc.js";
import { term as checkpoint } from "./checkpoint.js";
import { term as clusteringSorting } from "./clustering-sorting.js";
import { term as columnarStorage } from "./columnar-storage.js";
import { term as columnarVsRow } from "./columnar-vs-row.js";
import { term as compactionVacuum } from "./compaction-vacuum.js";
import { term as connectionPooling } from "./connection-pooling.js";
import { term as connectionStringDsn } from "./connection-string-dsn.js";
import { term as cte } from "./cte.js";
import { term as dataCatalog } from "./data-catalog.js";
import { term as dataClassification } from "./data-classification.js";
import { term as dataFabric } from "./data-fabric.js";
import { term as dataLakehouse } from "./data-lakehouse.js";
import { term as dataLineage } from "./data-lineage.js";
import { term as dataMaskingAnonymization } from "./data-masking-anonymization.js";
import { term as dataMesh } from "./data-mesh.js";
import { term as dataObservability } from "./data-observability.js";
import { term as dataQuality } from "./data-quality.js";
import { term as dataStewardship } from "./data-stewardship.js";
import { term as dataTiering } from "./data-tiering.js";
import { term as dataTokenization } from "./data-tokenization.js";
import { term as dataVault20 } from "./data-vault-2-0.js";
import { term as dataWarehouseVsDataLake } from "./data-warehouse-vs-data-lake.js";
import { term as databaseIndex } from "./database-index.js";
import { term as deadlock } from "./deadlock.js";
import { term as elt } from "./elt.js";
import { term as encryption } from "./encryption.js";
import { term as etl } from "./etl.js";
import { term as eventualConsistency } from "./eventual-consistency.js";
import { term as explainAnalyze } from "./explain-analyze.js";
import { term as explainPlanReadingOptimization } from "./explain-plan-reading-optimization.js";
import { term as factTableTypes } from "./fact-table-types.js";
import { term as featureStore } from "./feature-store.js";
import { term as foreignKeyReferentialIntegrity } from "./foreign-key-referential-integrity.js";
import { term as fullTextSearch } from "./full-text-search.js";
import { term as generatedComputedColumn } from "./generated-computed-column.js";
import { term as htap } from "./htap.js";
import { term as idempotency } from "./idempotency.js";
import { term as isolationLevels } from "./isolation-levels.js";
import { term as jsonJsonbInSql } from "./json-jsonb-in-sql.js";
import { term as kappaArchitecture } from "./kappa-architecture.js";
import { term as lambdaArchitecture } from "./lambda-architecture.js";
import { term as lateralJoin } from "./lateral-join.js";
import { term as llmDataPipeline } from "./llm-data-pipeline.js";
import { term as lockTypes } from "./lock-types.js";
import { term as masterDataManagement } from "./master-data-management.js";
import { term as materializedView } from "./materialized-view.js";
import { term as medallionArchitecture } from "./medallion-architecture.js";
import { term as messageQueueEventStreaming } from "./message-queue-event-streaming.js";
import { term as mvcc } from "./mvcc.js";
import { term as normalization1nf3nfBcnf } from "./normalization-1nf-3nf-bcnf.js";
import { term as nullHandling } from "./null-handling.js";
import { term as objectVsBlockVsFileStorage } from "./object-vs-block-vs-file-storage.js";
import { term as openTableFormat } from "./open-table-format.js";
import { term as orchestration } from "./orchestration.js";
import { term as ormVsRawSql } from "./orm-vs-raw-sql.js";
import { term as pacelcTheorem } from "./pacelc-theorem.js";
import { term as partitioning } from "./partitioning.js";
import { term as partitioningInBigqueryStyle } from "./partitioning-in-bigquery-style.js";
import { term as partitioningInPostgresql } from "./partitioning-in-postgresql.js";
import { term as primaryKeyCompositeKey } from "./primary-key-composite-key.js";
import { term as queryOptimizationExplain } from "./query-optimization-explain.js";
import { term as rbacColumnRowLevelSecurity } from "./rbac-column-row-level-security.js";
import { term as readYourWritesConsistency } from "./read-your-writes-consistency.js";
import { term as recursiveCte } from "./recursive-cte.js";
import { term as replication } from "./replication.js";
import { term as reverseEtl } from "./reverse-etl.js";
import { term as rowStorageVsColumnar } from "./row-storage-vs-columnar.js";
import { term as scd } from "./scd.js";
import { term as schemaNamespace } from "./schema-namespace.js";
import { term as schemaOnReadVsSchemaOnWrite } from "./schema-on-read-vs-schema-on-write.js";
import { term as schemaRegistry } from "./schema-registry.js";
import { term as semanticLayer } from "./semantic-layer.js";
import { term as sequenceAutoIncrement } from "./sequence-auto-increment.js";
import { term as sharding } from "./sharding.js";
import { term as snowflakeSchema } from "./snowflake-schema.js";
import { term as starSchema } from "./star-schema.js";
import { term as statisticsCostBasedOptimizer } from "./statistics-cost-based-optimizer.js";
import { term as storedProcedureFunction } from "./stored-procedure-function.js";
import { term as streamProcessing } from "./stream-processing.js";
import { term as surrogateKeyVsNaturalKey } from "./surrogate-key-vs-natural-key.js";
import { term as tableBloat } from "./table-bloat.js";
import { term as transactionSavepoint } from "./transaction-savepoint.js";
import { term as trigger } from "./trigger.js";
import { term as twoPhaseCommit } from "./two-phase-commit.js";
import { term as uniqueConstraintCheckConstraint } from "./unique-constraint-check-constraint.js";
import { term as upsert } from "./upsert.js";
import { term as uuidVsBigserial } from "./uuid-vs-bigserial.js";
import { term as vacuumAutovacuum } from "./vacuum-autovacuum.js";
import { term as vectorDatabase } from "./vector-database.js";
import { term as viewVsMaterializedView } from "./view-vs-materialized-view.js";
import { term as windowFunction } from "./window-function.js";
import { term as writeAheadLog } from "./write-ahead-log.js";

export const dataEngineeringTerms = [
  acid,
  auditLogging,
  base,
  batchProcessing,
  bloomFilter,
  caching,
  capTheorem,
  cardinality,
  cdc,
  checkpoint,
  clusteringSorting,
  columnarStorage,
  columnarVsRow,
  compactionVacuum,
  connectionPooling,
  connectionStringDsn,
  cte,
  dataCatalog,
  dataClassification,
  dataFabric,
  dataLakehouse,
  dataLineage,
  dataMaskingAnonymization,
  dataMesh,
  dataObservability,
  dataQuality,
  dataStewardship,
  dataTiering,
  dataTokenization,
  dataVault20,
  dataWarehouseVsDataLake,
  databaseIndex,
  deadlock,
  elt,
  encryption,
  etl,
  eventualConsistency,
  explainAnalyze,
  explainPlanReadingOptimization,
  factTableTypes,
  featureStore,
  foreignKeyReferentialIntegrity,
  fullTextSearch,
  generatedComputedColumn,
  htap,
  idempotency,
  isolationLevels,
  jsonJsonbInSql,
  kappaArchitecture,
  lambdaArchitecture,
  lateralJoin,
  llmDataPipeline,
  lockTypes,
  masterDataManagement,
  materializedView,
  medallionArchitecture,
  messageQueueEventStreaming,
  mvcc,
  normalization1nf3nfBcnf,
  nullHandling,
  objectVsBlockVsFileStorage,
  openTableFormat,
  orchestration,
  ormVsRawSql,
  pacelcTheorem,
  partitioning,
  partitioningInBigqueryStyle,
  partitioningInPostgresql,
  primaryKeyCompositeKey,
  queryOptimizationExplain,
  rbacColumnRowLevelSecurity,
  readYourWritesConsistency,
  recursiveCte,
  replication,
  reverseEtl,
  rowStorageVsColumnar,
  scd,
  schemaNamespace,
  schemaOnReadVsSchemaOnWrite,
  schemaRegistry,
  semanticLayer,
  sequenceAutoIncrement,
  sharding,
  snowflakeSchema,
  starSchema,
  statisticsCostBasedOptimizer,
  storedProcedureFunction,
  streamProcessing,
  surrogateKeyVsNaturalKey,
  tableBloat,
  transactionSavepoint,
  trigger,
  twoPhaseCommit,
  uniqueConstraintCheckConstraint,
  upsert,
  uuidVsBigserial,
  vacuumAutovacuum,
  vectorDatabase,
  viewVsMaterializedView,
  windowFunction,
  writeAheadLog,
];
