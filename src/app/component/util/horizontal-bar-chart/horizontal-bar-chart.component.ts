import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  ViewDimensions,
  BarChartType,
  DataItem,
  ColorHelper,
  StringOrNumberOrDate,
  Bar,
  BarOrientation,
  PlacementTypes,
  StyleTypes,
  ScaleType,
  escapeLabel,
  formatLabel,
  D0Types,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalBarChartComponent implements OnChanges {
  @Input() dims: ViewDimensions;
  @Input() type: BarChartType = BarChartType.Standard;
  @Input() series: DataItem[];
  @Input() xScale;
  @Input() yScale;
  @Input() colors: ColorHelper;
  @Input() tooltipDisabled: boolean = false;
  @Input() gradient: boolean;
  @Input() activeEntries: DataItem[];
  @Input() seriesName: StringOrNumberOrDate;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() roundEdges: boolean;
  @Input() animations: boolean = true;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() select: EventEmitter<DataItem> = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dataLabelWidthChanged = new EventEmitter<{ size: Event; index: number }>();

  tooltipPlacement: PlacementTypes;
  tooltipType: StyleTypes;
  bars: Bar[];
  barsForDataLabels: Array<{ x: number; y: number; width: number; height: number; total: number; series: string }> = [];

  barOrientation = BarOrientation;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.updateTooltipSettings();
    const d0 = {
      [D0Types.positive]: 0,
      [D0Types.negative]: 0,
    };
    let d0Type: D0Types;
    d0Type = D0Types.positive;
    let total;
    if (this.type === BarChartType.Normalized) {
      total = this.series.map((d) => d.value).reduce((sum, d) => (sum as any) + d, 0);
    }
    const xScaleMin = Math.max(this.xScale.domain()[0], 0);

    this.bars = this.series.map((d) => {
      let value = d.value as any;
      const label = this.getLabel(d);
      const formattedLabel = formatLabel(label);
      const roundEdges = this.roundEdges;
      d0Type = value > 0 ? D0Types.positive : D0Types.negative;

      const bar: any = {
        value,
        label,
        roundEdges,
        data: d,
        formattedLabel,
      };

      bar.height = this.yScale.bandwidth();

      if (this.type === BarChartType.Standard) {
        bar.width = Math.abs(this.xScale(value) - this.xScale(xScaleMin));
        if (value < 0) {
          bar.x = this.xScale(value);
        } else {
          bar.x = this.xScale(xScaleMin);
        }
        bar.y = this.yScale(label);
      } else if (this.type === BarChartType.Stacked) {
        const offset0 = d0[d0Type];
        const offset1 = offset0 + value;
        d0[d0Type] += value;

        bar.width = this.xScale(offset1) - this.xScale(offset0);
        bar.x = this.xScale(offset0);
        bar.y = 0;
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === BarChartType.Normalized) {
        let offset0 = d0[d0Type];
        let offset1 = offset0 + value;
        d0[d0Type] += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        bar.width = this.xScale(offset1) - this.xScale(offset0);
        bar.x = this.xScale(offset0);
        bar.y = 0;
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = (offset1 - offset0).toFixed(2) + '%';
      }

      if (this.colors.scaleType === ScaleType.Ordinal) {
        bar.color = this.colors.getColor(label);
      } else {
        if (this.type === BarChartType.Standard) {
          bar.color = this.colors.getColor(value);
          bar.gradientStops = this.colors.getLinearGradientStops(value);
        } else {
          bar.color = this.colors.getColor(bar.offset1);
          bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
        }
      }

      let tooltipLabel = formattedLabel;
      bar.ariaLabel = formattedLabel + ' ' + value.toLocaleString();
      if (this.seriesName !== null && this.seriesName !== undefined) {
        tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
        bar.data.series = this.seriesName;
        bar.ariaLabel = this.seriesName + ' ' + bar.ariaLabel;
      }

      bar.tooltipText = this.tooltipDisabled
        ? undefined
        : `
        <span class="tooltip-label">${escapeLabel(tooltipLabel)}</span>
        <span class="tooltip-val">${
          this.dataLabelFormatting ? this.dataLabelFormatting(value) : value.toLocaleString()
        }</span>
      `;

      return bar;
    });

    this.updateDataLabels();
  }

  updateDataLabels(): void {
    if (this.type === BarChartType.Stacked) {
      this.barsForDataLabels = [];
      const section: any = {};
      section.series = this.seriesName;
      const totalPositive = this.series.map((d) => d.value).reduce((sum, d) => (d > 0 ? sum + d : sum), 0);
      const totalNegative = this.series.map((d) => d.value).reduce((sum, d) => (d < 0 ? sum + d : sum), 0);
      section.total = totalPositive + totalNegative;
      section.x = 0;
      section.y = 0;
      // if total is positive then we show it on the right, otherwise on the left
      if (section.total > 0) {
        section.width = this.xScale(totalPositive);
      } else {
        section.width = this.xScale(totalNegative);
      }
      section.height = this.yScale.bandwidth();
      this.barsForDataLabels.push(section);
    } else {
      this.barsForDataLabels = this.series.map((d) => {
        const section: any = {};
        section.series = this.seriesName ?? d.label;
        section.total = d.value;
        section.x = this.xScale(0);
        section.y = this.yScale(d.label);
        section.width = this.xScale(section.total) - this.xScale(0);
        section.height = this.yScale.bandwidth();
        return section;
      });
    }
  }

  updateTooltipSettings(): void {
    if (!this.tooltipDisabled) {
      this.tooltipPlacement = PlacementTypes.Top;
      this.tooltipType = StyleTypes.tooltip;
    }
  }

  isActive(entry: DataItem): boolean {
    if (!this.activeEntries) return false;

    const item = this.activeEntries.find((active) => {
      return entry.name === active.name && entry.value === active.value;
    });

    return item !== undefined;
  }

  getLabel(dataItem: DataItem): StringOrNumberOrDate {
    if (dataItem.label) {
      return dataItem.label;
    }
    return dataItem.name;
  }

  trackBy(index: number, bar: Bar): string {
    return bar.label;
  }

  trackDataLabelBy(index: number, barLabel: any): string {
    return index + '#' + barLabel.series + '#' + barLabel.total;
  }

  click(data: DataItem): void {
    this.select.emit(data);
  }
}
