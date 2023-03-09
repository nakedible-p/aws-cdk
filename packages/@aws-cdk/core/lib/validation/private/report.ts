import * as os from 'os';
import { table } from 'table';
import { ConstructTree, ConstructTrace } from './construct-tree';
import { ReportTrace } from './trace';
import * as report from '../report';

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends report.ValidationViolation {
  /**
   * The constructs violating this rule.
   */
  readonly violatingConstructs: ValidationViolatingConstruct[];
}

/**
 * Construct violating a specific rule.
 */
export interface ValidationViolatingConstruct extends report.ValidationViolatingResource {
  /**
   * The construct path as defined in the application.
   *
   * @default - construct path will be empty if the cli is not run with `--debug`
   */
  readonly constructPath?: string;

  /**
   * A stack of constructs that lead to the violation.
   *
   * @default - stack will be empty if the cli is not run with `--debug`
   */
  readonly constructStack?: ConstructTrace;
}

/**
 * JSON representation of the report.
 */
export interface ValidationReportJson {
  /**
   * Report title.
   */
  readonly title: string;

  /**
   * Reports for all of the validation plugins registered
   * in the app
   */
  readonly pluginReports: PluginReportJson[];
}

/**
 * A report from a single plugin
 */
export interface PluginReportJson {
  /**
   * List of violations in the report.
   */
  readonly violations: ValidationViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: ValidationReportSummary;
}

/**
 * Summary of the report.
 */
export interface ValidationReportSummary {
  /**
   * The final status of the validation (pass/fail)
   */
  readonly status: report.ValidationReportStatus;

  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;

  /**
   * Additional metadata about the report. This property is intended
   * to be used by plugins to add additional information.
   *
   * @default - no metadata
   */
  readonly metadata?: { readonly [key: string]: string };
}


/**
 * The report emitted by the plugin after evaluation.
 */
export class ValidationReportFormatter {
  private readonly reportTrace: ReportTrace;
  constructor(private readonly tree: ConstructTree) {
    this.reportTrace = new ReportTrace(tree);
  }


  public formatPrettyPrinted(reps: report.NamedValidationPluginReport[]): string {
    const json = this.formatJson(reps);
    const output = [json.title];

    output.push('-'.repeat(json.title.length));
    json.pluginReports.forEach(plugin => {
      output.push('');
      output.push('(Summary)');
      output.push('');
      output.push(table([
        ['Status', plugin.summary.status],
        ['Plugin', plugin.summary.pluginName],
        ...Object.entries(plugin.summary.metadata ?? {}),
      ]));

      if (plugin.violations.length > 0) {
        output.push('');
        output.push('(Violations)');
      }

      plugin.violations.forEach((violation) => {
        const constructs = violation.violatingConstructs;
        const occurrences = constructs.length;
        const title = reset(red(bright(`${violation.ruleName} (${occurrences} occurrences)`)));
        output.push('');
        output.push(title);
        output.push('');
        output.push('  Occurrences:');
        for (const construct of constructs) {
          output.push('');
          output.push(`    - Construct Path: ${construct.constructPath ?? 'N/A'}`);
          output.push(`    - Template Path: ${construct.templatePath}`);
          output.push(`    - Creation Stack:\n\t${this.reportTrace.formatPrettyPrinted(construct.constructPath)}`);
          output.push(`    - Resource ID: ${construct.resourceLogicalId}`);
          if (construct.locations) {
            output.push('    - Locations:');
            for (const location of construct.locations) {
              output.push(`      > ${location}`);
            }
          }
        }
        output.push('');
        output.push(`  Description: ${plugin.violations[0].description }`);
        if (plugin.violations[0].fix) {
          output.push(`  How to fix: ${plugin.violations[0].fix}`);
        }
      });

    });

    return output.join(os.EOL);
  }

  public formatJson(reps: report.NamedValidationPluginReport[]): ValidationReportJson {
    return {
      title: 'Validation Report',
      pluginReports: reps
        .filter(rep => !rep.success)
        .map(rep => ({
          summary: {
            pluginName: rep.pluginName,
            status: rep.success ? report.ValidationReportStatus.SUCCESS : report.ValidationReportStatus.FAILURE,
            metadata: rep.metadata,
          },
          violations: rep.violations.map(violation => ({
            ruleName: violation.ruleName,
            description: violation.description,
            fix: violation.fix,
            violatingConstructs: violation.violatingResources.map(resource => {
              const constructPath = this.tree.getConstructByLogicalId(resource.resourceLogicalId)?.node.path;
              return {
                constructStack: this.reportTrace.formatJson(constructPath),
                constructPath: constructPath,
                locations: resource.locations,
                resourceLogicalId: resource.resourceLogicalId,
                templatePath: resource.templatePath,
              };
            }),
          })),
        })),
    };
  }
}


function reset(s: string) {
  return `${s}\x1b[0m`;
}

function red(s: string) {
  return `\x1b[31m${s}`;
}

function bright(s: string) {
  return `\x1b[1m${s}`;
}
